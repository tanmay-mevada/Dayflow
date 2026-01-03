// utils/send-notification-email.ts
import nodemailer from 'nodemailer';

export async function sendNotificationEmail(
  email: string,
  recipientName: string,
  subject: string,
  message: string,
  senderName?: string,
  companyName?: string
) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const sender = senderName || 'Administration';
    const company = companyName || 'Company';

    const mailOptions = {
      from: `"${company}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">${subject}</h1>
              <p style="margin: 8px 0 0 0; color: #e9d5ff; font-size: 14px;">${company}</p>
            </div>

            <!-- Content -->
            <div style="padding: 32px 24px;">
              <p style="font-size: 16px; color: #1f2937; margin: 0 0 16px 0; line-height: 1.5;">Hello ${recipientName},</p>
              
              <div style="font-size: 15px; color: #4b5563; margin: 0 0 24px 0; line-height: 1.8; white-space: pre-wrap;">
                ${message}
              </div>

              <p style="font-size: 14px; color: #9ca3af; margin: 24px 0 0 0;">
                Best regards,<br>
                <strong>${sender}</strong><br>
                <span style="font-size: 13px;">${company}</span>
              </p>
            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                This is an automated notification from ${company}. Please contact your administrator if you have any questions.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Notification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send notification email:', error);
    throw new Error('Email send failed');
  }
}

