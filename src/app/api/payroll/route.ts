import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { PayrollRecord } from '@/models/payrollRecord';
import { Salary } from '@/models/salary';
import { User } from '@/models/user';

// GET - Get payroll records
export async function GET(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const isAdmin = user.role === 'admin' || user.role === 'hr_officer';
    const targetEmployeeId = isAdmin && employeeId ? employeeId : user._id.toString();

    // If admin is viewing someone else's payroll, verify the employee exists
    if (isAdmin && employeeId && employeeId !== user._id.toString()) {
      const targetUser = await User.findById(employeeId);
      if (!targetUser) {
        return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
      }
    }

    const query: any = { employeeId: targetEmployeeId };
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const payrollRecords = await PayrollRecord.find(query)
      .sort({ year: -1, month: -1 })
      .populate('employeeId', 'firstName lastName employeeId')
      .limit(12);

    return NextResponse.json({ payrollRecords });
  } catch (err) {
    console.error('Get payroll error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Process payroll (Admin/HR only)
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

    const { employeeId, month, year, deductions } = await req.json();

    if (!employeeId || !month || !year) {
      return NextResponse.json({ 
        error: 'Employee ID, month, and year are required' 
      }, { status: 400 });
    }

    // Check if payroll already exists for this month
    const existing = await PayrollRecord.findOne({
      employeeId,
      month: parseInt(month),
      year: parseInt(year)
    });

    if (existing) {
      return NextResponse.json({ 
        error: 'Payroll already processed for this month' 
      }, { status: 400 });
    }

    // Get employee's salary
    const salary = await Salary.findOne({ 
      employeeId, 
      isActive: true 
    });

    if (!salary) {
      return NextResponse.json({ 
        error: 'Salary information not found for employee' 
      }, { status: 404 });
    }

    // Create payroll record
    const payrollRecord = await PayrollRecord.create({
      employeeId,
      month: parseInt(month),
      year: parseInt(year),
      basicSalary: salary.basicSalary,
      hra: salary.hra,
      allowances: salary.allowances,
      deductions: deductions || salary.deductions || 0,
      status: 'processed',
      processedAt: new Date()
    });

    return NextResponse.json({ 
      message: 'Payroll processed successfully',
      payrollRecord 
    });
  } catch (err) {
    console.error('Process payroll error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
