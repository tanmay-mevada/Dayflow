import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { Document } from '@/models/document';
import { User } from '@/models/user';

// GET - Get documents
export async function GET(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');
    const documentType = searchParams.get('documentType');

    const isAdmin = user.role === 'admin' || user.role === 'hr_officer';
    const targetEmployeeId = isAdmin && employeeId ? employeeId : user._id.toString();

    // If admin is viewing someone else's documents, verify the employee exists
    if (isAdmin && employeeId && employeeId !== user._id.toString()) {
      const targetUser = await User.findById(employeeId);
      if (!targetUser) {
        return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
      }
    }

    const query: any = { employeeId: targetEmployeeId };
    if (documentType) {
      query.documentType = documentType;
    }

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'firstName lastName');

    return NextResponse.json({ documents });
  } catch (err) {
    console.error('Get documents error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Upload document
export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { employeeId, documentType, fileName, fileUrl, fileSize } = await req.json();

    if (!documentType || !fileName || !fileUrl) {
      return NextResponse.json({ 
        error: 'Document type, file name, and file URL are required' 
      }, { status: 400 });
    }

    const isAdmin = user.role === 'admin' || user.role === 'hr_officer';
    const targetEmployeeId = isAdmin && employeeId ? employeeId : user._id.toString();

    // Employees can only upload their own documents
    if (!isAdmin && targetEmployeeId !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const document = await Document.create({
      employeeId: targetEmployeeId,
      documentType,
      fileName,
      fileUrl,
      fileSize,
      uploadedBy: user._id
    });

    return NextResponse.json({ 
      message: 'Document uploaded successfully',
      document 
    });
  } catch (err) {
    console.error('Upload document error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

