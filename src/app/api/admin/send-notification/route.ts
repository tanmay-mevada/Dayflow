import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { User } from '@/models/user';
import { sendNotificationEmail } from '@/utils/sendNotificationEmail';

export async function POST(req: Request) {
  try {
    await connectDB();
    const admin = await getCurrentUser();

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = admin.role === 'admin' || admin.role === 'hr_officer';
    if (!isAdmin) {
      return NextResponse.json({ 
        error: 'Forbidden. Only admin/HR can send notifications.' 
      }, { status: 403 });
    }

    const { subject, message, recipientIds, sendToAll } = await req.json();

    // Validation
    if (!subject || !message) {
      return NextResponse.json({ 
        error: 'Subject and message are required' 
      }, { status: 400 });
    }

    if (!sendToAll && (!recipientIds || recipientIds.length === 0)) {
      return NextResponse.json({ 
        error: 'Please select at least one recipient or choose to send to all employees' 
      }, { status: 400 });
    }

    // Get recipients
    let recipients;
    if (sendToAll) {
      recipients = await User.find({ 
        role: 'employee',
        isVerified: true 
      }).select('email firstName lastName');
    } else {
      recipients = await User.find({ 
        _id: { $in: recipientIds },
        isVerified: true 
      }).select('email firstName lastName');
    }

    if (recipients.length === 0) {
      return NextResponse.json({ 
        error: 'No valid recipients found' 
      }, { status: 400 });
    }

    // Get admin info for sender name
    const adminUser = await User.findById(admin.id);
    const senderName = adminUser 
      ? `${adminUser.firstName} ${adminUser.lastName}` 
      : 'Administration';
    const companyName = adminUser?.companyName || 'Company';

    // Send emails
    const emailResults = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const recipient of recipients) {
      try {
        await sendNotificationEmail(
          recipient.email,
          recipient.firstName || 'Employee',
          subject,
          message,
          senderName,
          companyName
        );
        emailResults.success++;
      } catch (error: any) {
        emailResults.failed++;
        emailResults.errors.push(`${recipient.email}: ${error.message}`);
        console.error(`Failed to send email to ${recipient.email}:`, error);
      }
    }

    return NextResponse.json({ 
      message: `Notification sent to ${emailResults.success} employee(s)`,
      results: {
        total: recipients.length,
        success: emailResults.success,
        failed: emailResults.failed,
        errors: emailResults.errors.length > 0 ? emailResults.errors : undefined,
      }
    });
  } catch (err: any) {
    console.error('Send notification error:', err);
    return NextResponse.json({ 
      error: err.message || 'Server error' 
    }, { status: 500 });
  }
}

