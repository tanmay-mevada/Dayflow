import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { User } from '@/models/user';
import { generateLoginId, generatePassword } from '@/lib/generateLoginId';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '@/utils/sendOtpEmail';

export async function POST(req: Request) {
  try {
    await connectDB();
    const admin = await getCurrentUser();

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = admin.role === 'admin' || admin.role === 'hr_officer';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden. Only admin/HR can create employees.' }, { status: 403 });
    }

    const {
      companyName,
      firstName,
      lastName,
      email,
      phoneNumber,
      designation,
      department,
      dateOfJoining,
      role,
      managerId
    } = await req.json();

    // Validation
    if (!companyName || !firstName || !lastName || !email || !dateOfJoining) {
      return NextResponse.json({ 
        error: 'Company name, first name, last name, email, and date of joining are required' 
      }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Generate employee ID (EMP-XXXX format)
    function generateEmployeeId(): string {
      const prefix = 'EMP';
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      return `${prefix}-${randomNum}`;
    }

    let employeeId = generateEmployeeId();
    let exists = await User.findOne({ employeeId });
    while (exists) {
      employeeId = generateEmployeeId();
      exists = await User.findOne({ employeeId });
    }

    // Generate Login ID
    const joiningDate = new Date(dateOfJoining);
    const loginId = await generateLoginId(companyName, firstName, lastName, joiningDate);

    // Generate auto password
    const autoPassword = generatePassword(12);

    // Hash password
    const hashedPassword = await bcrypt.hash(autoPassword, 10);

    // Prepare user data
    const userData: any = {
      companyName,
      firstName,
      lastName,
      email,
      phoneNumber,
      employeeId,
      loginId,
      password: hashedPassword,
      designation,
      department,
      dateOfJoining: joiningDate,
      role: role || 'employee',
      isVerified: true, // Admin creates verified users
      isPasswordChanged: false,
    };

    // Only include managerId if it's provided and not empty
    if (managerId && managerId.trim() !== '') {
      userData.managerId = managerId;
    }

    // Create user
    const newUser = await User.create(userData);

    // Send email with login credentials
    // You can create a utility function to send credentials email
    // For now, we'll return the credentials (in production, send via email)

    return NextResponse.json({ 
      message: 'Employee created successfully',
      employee: {
        id: newUser._id,
        loginId: newUser.loginId,
        email: newUser.email,
        employeeId: newUser.employeeId,
        password: autoPassword, // Only return on creation, never again
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
      note: 'Please save these credentials securely. The password should be shared with the employee.'
    });
  } catch (err: any) {
    console.error('Create employee error:', err);
    return NextResponse.json({ 
      error: err.message || 'Server error' 
    }, { status: 500 });
  }
}

