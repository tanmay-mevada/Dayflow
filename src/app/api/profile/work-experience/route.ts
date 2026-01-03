import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { WorkExperience } from '@/models/workExperience';

// GET - Get work experience
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

    const workExperience = await WorkExperience.find({ employeeId: targetEmployeeId })
      .sort({ startDate: -1 });

    return NextResponse.json({ workExperience });
  } catch (err) {
    console.error('Get work experience error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Add work experience
export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      companyName, 
      jobTitle, 
      startDate, 
      endDate, 
      isCurrentJob,
      description, 
      location, 
      achievements 
    } = await req.json();

    if (!companyName || !jobTitle || !startDate) {
      return NextResponse.json({ 
        error: 'Company name, job title, and start date are required' 
      }, { status: 400 });
    }

    const workExp = await WorkExperience.create({
      employeeId: user._id,
      companyName,
      jobTitle,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      isCurrentJob: isCurrentJob || false,
      description,
      location,
      achievements
    });

    return NextResponse.json({ 
      message: 'Work experience added successfully',
      workExperience: workExp 
    });
  } catch (err) {
    console.error('Add work experience error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

