import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { User } from '@/models/user';

// GET - Get single employee details (Admin/HR only)
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    // Await params for Next.js 15+ (this is the fix!)
    const { id } = await context.params;

    console.log('API called for employee ID:', id); // Debug log
    console.log('Current user:', user?.email, user?.role); // Debug log

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = user.role === 'admin' || user.role === 'hr_officer';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Validate MongoDB ObjectId format
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error('Invalid employee ID format:', id);
      return NextResponse.json({ error: 'Invalid employee ID format' }, { status: 400 });
    }

    const employee = await User.findById(id)
      .select('-password -otp -otpExpires -resetToken -resetTokenExpiry');

    console.log('Employee found:', employee ? 'Yes' : 'No'); // Debug log

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({ employee });
  } catch (err) {
    console.error('Get employee error:', err);
    return NextResponse.json({ 
      error: 'Server error',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE - Delete an employee (Admin only)
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    // Await params for Next.js 15+
    const { id } = await context.params;

    console.log('Delete request for employee ID:', id);
    console.log('Current user:', user?.email, user?.role);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can delete employees
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Validate MongoDB ObjectId format
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error('Invalid employee ID format:', id);
      return NextResponse.json({ error: 'Invalid employee ID format' }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }

    const employee = await User.findById(id);

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Delete the employee
    await User.findByIdAndDelete(id);

    console.log('Employee deleted successfully:', id);

    return NextResponse.json({ 
      message: 'Employee deleted successfully',
      deletedEmployee: {
        id: employee._id,
        name: `${employee.firstName} ${employee.lastName}`,
        email: employee.email
      }
    });
  } catch (err) {
    console.error('Delete employee error:', err);
    return NextResponse.json({ 
      error: 'Server error',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}