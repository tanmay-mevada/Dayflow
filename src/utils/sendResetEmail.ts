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
    from: `"Turbo Platform Support" <turbo.cpp.nu@gmail.com>`,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 40px 16px;">
        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 28px 24px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600;">
              Password Reset
            </h1>
            <p style="margin-top: 8px; color: #bfdbfe; font-size: 14px;">
              DayFlow Platform
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 32px 24px;">
            <p style="font-size: 16px; color: #111827; margin-bottom: 16px;">
              Hello,
            </p>

            <p style="font-size: 15px; color: #374151; line-height: 1.6; margin-bottom: 24px;">
              We received a request to reset your account password.
              Click the button below to set a new password.
            </p>

            <!-- Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a
                href="${resetLink}"
                style="
                  display: inline-block;
                  background: linear-gradient(135deg, #2563eb, #1d4ed8);
                  color: #ffffff;
                  padding: 14px 36px;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: 600;
                  font-size: 15px;
                  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
                "
              >
                Reset Password
              </a>
            </div>

            <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
              This link will expire in <strong>15 minutes</strong>.
            </p>

            <p style="font-size: 14px; color: #6b7280;">
              If you didn’t request this, you can safely ignore this email.
            </p>

            <p style="font-size: 14px; color: #9ca3af; margin-top: 28px;">
              Regards,<br />
              <strong>DayFlow ~ Team TurboCPP</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 18px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
              Need help? Contact us at
              <a
                href="mailto:turbo.cpp.nu@gmail.com"
                style="color: #2563eb; text-decoration: none; font-weight: 500;"
              >
                turbo.cpp.nu@gmail.com
              </a>
            </p>
          </div>

        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
