// lib/send-reset-email.ts
import nodemailer from 'nodemailer';

export async function sendResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"DStrA Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your Password - DStrA',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
        <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 32px 24px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 22px; font-weight: 600;">Password Reset</h1>
            <p style="margin: 8px 0 0 0; color: #fecaca; font-size: 14px;">DStrA Platform</p>
          </div>

          <!-- Content -->
          <div style="padding: 32px 24px;">
            <p style="font-size: 16px; color: #1f2937; margin: 0 0 16px 0; line-height: 1.5;">Hello,</p>
            
            <p style="font-size: 15px; color: #4b5563; margin: 0 0 24px 0; line-height: 1.6;">
              We received a request to reset your password. Click the button below to create a new password for your account:
            </p>

            <!-- Reset Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3); transition: all 0.2s;">
                Reset Password
              </a>
            </div>

            <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0; line-height: 1.5;">
              This password reset link will expire in <strong>15 minutes</strong>.
            </p>

            <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px 0; line-height: 1.5;">
              If you didn't request this password reset, please ignore this email or contact support if you have concerns.
            </p>

            <p style="font-size: 14px; color: #9ca3af; margin: 24px 0 0 0;">
              Best regards,<br>
              <strong>The DStrA Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
              Need help? Contact us at 
              <a href="mailto:dstra0.2.68@gmail.com" style="color: #2563EB; text-decoration: none;">support@dstra.com</a>
            </p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}