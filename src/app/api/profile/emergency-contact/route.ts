import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { EmergencyContact } from '@/models/emergencyContact';

// GET - Get emergency contacts
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

    const contacts = await EmergencyContact.find({ employeeId: targetEmployeeId });

    return NextResponse.json({ contacts });
  } catch (err) {
    console.error('Get emergency contacts error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Add emergency contact
export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, relationship, phoneNumber, email, address, isPrimary } = await req.json();

    if (!name || !relationship || !phoneNumber) {
      return NextResponse.json({ 
        error: 'Name, relationship, and phone number are required' 
      }, { status: 400 });
    }

    // If setting as primary, unset other primary contacts
    if (isPrimary) {
      await EmergencyContact.updateMany(
        { employeeId: user._id },
        { isPrimary: false }
      );
    }

    const contact = await EmergencyContact.create({
      employeeId: user._id,
      name,
      relationship,
      phoneNumber,
      email,
      address,
      isPrimary: isPrimary || false
    });

    return NextResponse.json({ 
      message: 'Emergency contact added successfully',
      contact 
    });
  } catch (err) {
    console.error('Add emergency contact error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

