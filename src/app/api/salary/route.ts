import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { Salary } from '@/models/salary';
import { User } from '@/models/user';

// GET - Get salary information
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

    // Only admin can view others' salary, employees can only view their own
    if (!isAdmin && employeeId && employeeId !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // If admin is viewing someone else's salary, verify the employee exists
    if (isAdmin && employeeId && employeeId !== user._id.toString()) {
      const targetUser = await User.findById(employeeId);
      if (!targetUser) {
        return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
      }
    }

    const salary = await Salary.findOne({ 
      employeeId: targetEmployeeId,
      isActive: true 
    }).populate('employeeId', 'firstName lastName employeeId');

    if (!salary) {
      return NextResponse.json({ error: 'Salary information not found' }, { status: 404 });
    }

    return NextResponse.json({ salary });
  } catch (err) {
    console.error('Get salary error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Create/Update salary (Admin/HR only)
export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = user.role === 'admin' || user.role === 'hr_officer';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { 
      employeeId, 
      basicSalary, 
      hra, 
      allowances, 
      deductions,
      salaryType,
      bankAccountNumber,
      bankName,
      ifscCode,
      effectiveFrom 
    } = await req.json();

    if (!employeeId || !basicSalary) {
      return NextResponse.json({ 
        error: 'Employee ID and basic salary are required' 
      }, { status: 400 });
    }

    // Verify employee exists
    const employee = await User.findById(employeeId);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Deactivate previous salary records
    await Salary.updateMany(
      { employeeId, isActive: true },
      { isActive: false, effectiveTo: new Date() }
    );

    // Create new salary record
    const salary = await Salary.create({
      employeeId,
      basicSalary,
      hra: hra || 0,
      allowances: allowances || 0,
      deductions: deductions || 0,
      salaryType: salaryType || 'monthly',
      bankAccountNumber,
      bankName,
      ifscCode,
      effectiveFrom: effectiveFrom ? new Date(effectiveFrom) : new Date()
    });

    return NextResponse.json({ 
      message: 'Salary information saved successfully',
      salary 
    });
  } catch (err) {
    console.error('Create salary error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
