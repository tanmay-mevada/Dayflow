import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { User } from '@/models/user';
import { EmergencyContact } from '@/models/emergencyContact';
import { EducationalBackground } from '@/models/educationalBackground';
import { WorkExperience } from '@/models/workExperience';
import { Skill } from '@/models/skill';

// GET - Get user profile
export async function GET(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');

    const isAdmin = user.role === 'admin' || user.role === 'hr_officer';
    const targetEmployeeId = isAdmin && employeeId ? employeeId : user._id.toString();

    // If admin is viewing someone else's profile, verify the employee exists
    if (isAdmin && employeeId && employeeId !== user._id.toString()) {
      const targetUser = await User.findById(employeeId);
      if (!targetUser) {
        return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
      }
    }

    const profile = await User.findById(targetEmployeeId)
      .select('-password -otp -otpExpires -resetToken -resetTokenExpiry')
      .populate('managerId', 'firstName lastName employeeId');

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get related data
    const [emergencyContacts, education, workExperience, skills] = await Promise.all([
      EmergencyContact.find({ employeeId: targetEmployeeId }),
      EducationalBackground.find({ employeeId: targetEmployeeId }),
      WorkExperience.find({ employeeId: targetEmployeeId }),
      Skill.find({ employeeId: targetEmployeeId })
    ]);

    return NextResponse.json({
      profile: {
        ...profile.toObject(),
        emergencyContacts,
        education,
        workExperience,
        skills
      }
    });
  } catch (err) {
    console.error('Get profile error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT - Update profile
export async function PUT(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');

    const isAdmin = user.role === 'admin' || user.role === 'hr_officer';
    const targetEmployeeId = isAdmin && employeeId ? employeeId : user._id.toString();

    // Employees can only update their own profile (except admin can update any)
    if (!isAdmin && targetEmployeeId !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData = await req.json();
    
    // Fields that employees can update
    const employeeUpdatableFields = [
      'phoneNumber', 
      'address', 
      'profilePicture',
      'dateOfBirth',
      'gender',
      'maritalStatus',
      'nationality'
    ];

    // Fields that only admin can update
    const adminOnlyFields = [
      'firstName',
      'lastName',
      'employeeId',
      'designation',
      'department',
      'dateOfJoining',
      'employmentStatus',
      'managerId',
      'role'
    ];

    // Filter update data based on role
    const allowedFields = isAdmin 
      ? { ...updateData }
      : Object.keys(updateData)
          .filter(key => employeeUpdatableFields.includes(key))
          .reduce((obj, key) => {
            obj[key] = updateData[key];
            return obj;
          }, {} as any);

    const updatedUser = await User.findByIdAndUpdate(
      targetEmployeeId,
      { $set: allowedFields },
      { new: true }
    ).select('-password -otp -otpExpires -resetToken -resetTokenExpiry');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      profile: updatedUser 
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

