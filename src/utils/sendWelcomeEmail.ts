// utils/send-welcome-email.ts
import nodemailer from 'nodemailer';

export async function sendWelcomeEmail(
  email: string,
  firstName: string,
  loginId: string,
  password: string,
  employeeId: string,
  companyName: string
) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${companyName}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to ${companyName} - Your Account Details`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2563EB 0%, #1e40af 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">Welcome to ${companyName}!</h1>
              <p style="margin: 8px 0 0 0; color: #e2e8f0; font-size: 14px;">Your account has been created</p>
            </div>

            <!-- Content -->
            <div style="padding: 32px 24px;">
              <p style="font-size: 16px; color: #1f2937; margin: 0 0 16px 0; line-height: 1.5;">Hello ${firstName},</p>
              
              <p style="font-size: 15px; color: #4b5563; margin: 0 0 24px 0; line-height: 1.6;">
                We're excited to have you on board! Your account has been successfully created. Please find your login credentials below:
              </p>

              <!-- Credentials Box -->
              <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <div style="margin-bottom: 16px;">
                  <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; font-weight: 600;">Employee ID</div>
                  <div style="font-size: 18px; font-weight: 700; color: #1e40af; font-family: 'Courier New', monospace;">
                    ${employeeId}
                  </div>
                </div>
                <div style="margin-bottom: 16px;">
                  <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; font-weight: 600;">Login ID</div>
                  <div style="font-size: 18px; font-weight: 700; color: #1e40af; font-family: 'Courier New', monospace;">
                    ${loginId}
                  </div>
                </div>
                <div>
                  <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; font-weight: 600;">Temporary Password</div>
                  <div style="font-size: 18px; font-weight: 700; color: #dc2626; font-family: 'Courier New', monospace;">
                    ${password}
                  </div>
                </div>
              </div>

              <p style="font-size: 14px; color: #dc2626; margin: 0 0 24px 0; line-height: 1.5; font-weight: 600;">
                ⚠️ Important: Please change your password after your first login for security purposes.
              </p>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXTAUTH_URL}/auth/login" style="display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #1e40af 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);">
                  Login to Your Account
                </a>
              </div>

              <p style="font-size: 14px; color: #6b7280; margin: 24px 0 0 0; line-height: 1.5;">
                If you have any questions or need assistance, please don't hesitate to contact our support team.
              </p>

              <p style="font-size: 14px; color: #9ca3af; margin: 24px 0 0 0;">
                Best regards,<br>
                <strong>The ${companyName} Team</strong>
              </p>
            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                This is an automated message. Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw new Error('Email send failed');
  }
}

