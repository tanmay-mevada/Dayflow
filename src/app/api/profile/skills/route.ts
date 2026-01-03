import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { Skill } from '@/models/skill';

// GET - Get skills
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

    const skills = await Skill.find({ employeeId: targetEmployeeId });

    return NextResponse.json({ skills });
  } catch (err) {
    console.error('Get skills error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Add skill
export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { skillName, proficiency, category } = await req.json();

    if (!skillName) {
      return NextResponse.json({ 
        error: 'Skill name is required' 
      }, { status: 400 });
    }

    // Check if skill already exists for this user
    const existing = await Skill.findOne({ 
      employeeId: user._id, 
      skillName: skillName.toLowerCase() 
    });

    if (existing) {
      return NextResponse.json({ 
        error: 'Skill already exists' 
      }, { status: 400 });
    }

    const skill = await Skill.create({
      employeeId: user._id,
      skillName: skillName.toLowerCase(),
      proficiency,
      category
    });

    return NextResponse.json({ 
      message: 'Skill added successfully',
      skill 
    });
  } catch (err) {
    console.error('Add skill error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE - Remove skill
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const skillId = searchParams.get('skillId');

    if (!skillId) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
    }

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // Only user can delete their own skills
    if (skill.employeeId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Skill.findByIdAndDelete(skillId);

    return NextResponse.json({ message: 'Skill removed successfully' });
  } catch (err) {
    console.error('Delete skill error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

