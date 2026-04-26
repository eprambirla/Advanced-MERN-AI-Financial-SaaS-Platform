import { sendEmail } from "./mailer";

type Params = {
  to: string;
  resetLink: string;
};

export const sendPasswordResetEmail = async ({ to, resetLink }: Params) => {
  const subject = "Reset your Finora password";
  
  const text = `Click the link below to reset your Finora password:\n${resetLink}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 20px; margin: 0;">
      <div style="max-width: 400px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #0f172a; font-size: 24px; margin: 0;">Reset Your Password</h1>
        </div>
        
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
          You requested to reset your Finora password. Click the button below to create a new password:
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 20px 0 0;">
          This link will expire in <strong>1 hour</strong>.
        </p>
        
        <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 12px 0 0;">
          If you didn't request this, please ignore this email or contact support if you have concerns.
        </p>
        
        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            © 2026 Finora. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, text, html });
};