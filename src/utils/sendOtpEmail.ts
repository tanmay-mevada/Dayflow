// lib/send-otp-email.ts
import nodemailer from 'nodemailer';

export async function sendOtpEmail(email: string, otp: string) {
  try {
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
      subject: 'Verify your Email - DStrA',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2563EB 0%, #1e40af 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 22px; font-weight: 600;">Email Verification</h1>
              <p style="margin: 8px 0 0 0; color: #e2e8f0; font-size: 14px;">DStrA Platform</p>
            </div>

            <!-- Content -->
            <div style="padding: 32px 24px;">
              <p style="font-size: 16px; color: #1f2937; margin: 0 0 16px 0; line-height: 1.5;">Hello,</p>
              
              <p style="font-size: 15px; color: #4b5563; margin: 0 0 24px 0; line-height: 1.6;">
                We received a request to create a new account with this email address. Please use the verification code below to complete your registration:
              </p>

              <!-- OTP Display -->
              <div style="text-align: center; margin: 32px 0;">
                <div style="display: inline-block; background: #f1f5f9; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px 24px;">
                  <div style="font-size: 28px; font-weight: 700; color: #1e40af; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                    ${otp}
                  </div>
                </div>
              </div>

              <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px 0; line-height: 1.5;">
                This verification code will expire in <strong>10 minutes</strong>. If you didn't request this, please ignore this email.
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

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw new Error('Email send failed');
  }
}