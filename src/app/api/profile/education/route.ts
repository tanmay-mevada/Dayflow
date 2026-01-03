import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { EducationalBackground } from '@/models/educationalBackground';

// GET - Get educational background
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

    const education = await EducationalBackground.find({ employeeId: targetEmployeeId })
      .sort({ endDate: -1 });

    return NextResponse.json({ education });
  } catch (err) {
    console.error('Get education error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Add educational background
export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      degree, 
      fieldOfStudy, 
      institution, 
      startDate, 
      endDate, 
      grade, 
      certificateUrl 
    } = await req.json();

    if (!degree || !institution) {
      return NextResponse.json({ 
        error: 'Degree and institution are required' 
      }, { status: 400 });
    }

    const education = await EducationalBackground.create({
      employeeId: user._id,
      degree,
      fieldOfStudy,
      institution,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      grade,
      certificateUrl
    });

    return NextResponse.json({ 
      message: 'Educational background added successfully',
      education 
    });
  } catch (err) {
    console.error('Add education error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

