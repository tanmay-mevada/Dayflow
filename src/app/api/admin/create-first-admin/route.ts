import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/user';
import { generateLoginId, generatePassword } from '@/lib/generateLoginId';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/utils/sendWelcomeEmail';

/**
 * One-time route to create the first admin user
 * Only works if no admin exists in the system
 * DELETE THIS ROUTE AFTER CREATING THE FIRST ADMIN FOR SECURITY
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    // Check if any admin already exists
    const existingAdmin = await User.findOne({ 
      role: { $in: ['admin', 'hr_officer'] } 
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        error: 'Admin user already exists. Please use the regular employee creation flow.' 
      }, { status: 400 });
    }

    const {
      companyName,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      designation,
      department,
      dateOfJoining
    } = await req.json();

    // Validation
    if (!companyName || !firstName || !lastName || !email || !password || !dateOfJoining) {
      return NextResponse.json({ 
        error: 'Company name, first name, last name, email, password, and date of joining are required' 
      }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Generate employee ID
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const adminUser = await User.create({
      companyName,
      firstName,
      lastName,
      email,
      phoneNumber,
      employeeId,
      loginId,
      password: hashedPassword,
      designation: designation || 'Administrator',
      department: department || 'Administration',
      dateOfJoining: joiningDate,
      role: 'admin',
      isVerified: true,
      isPasswordChanged: true, // Since they set their own password
    });

    // Send welcome email with login credentials
    try {
      await sendWelcomeEmail(
        email,
        firstName,
        loginId,
        password,
        employeeId,
        companyName
      );
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue even if email fails - admin is still created
    }

    return NextResponse.json({ 
      message: 'First admin user created successfully! Welcome email sent.',
      admin: {
        id: adminUser._id,
        loginId: adminUser.loginId,
        email: adminUser.email,
        employeeId: adminUser.employeeId,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
      },
      warning: 'IMPORTANT: Delete this API route (/api/admin/create-first-admin) after creating the first admin for security!'
    });
  } catch (err: any) {
    console.error('Create first admin error:', err);
    return NextResponse.json({ 
      error: err.message || 'Server error' 
    }, { status: 500 });
  }
}

