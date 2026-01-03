import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { Document } from '@/models/document';

// DELETE - Delete document
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const document = await Document.findById(params.id);
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const isAdmin = user.role === 'admin' || user.role === 'hr_officer';
    
    // Only admin or document owner can delete
    if (!isAdmin && document.employeeId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Document.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error('Delete document error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

