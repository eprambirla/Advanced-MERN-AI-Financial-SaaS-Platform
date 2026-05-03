import { sendEmail } from "./mailer";

type Params = {
  to: string;
  verificationLink: string;
};

export const sendEmailVerificationEmail = async ({ to, verificationLink }: Params) => {
  const subject = "Verify your Finora email address";

  const text = `Click the link below to verify your Finora email address:\n${verificationLink}\n\nThis link expires in 24 hours.\n\nIf you didn't create an account, please ignore this email.`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 20px; margin: 0;">
      <div style="max-width: 400px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #0f172a; font-size: 24px; margin: 0;">Verify Your Email</h1>
        </div>

        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
          Welcome to Finora! Click the button below to verify your email address:
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${verificationLink}" style="display: inline-block; background-color: #22c55e; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px;">
            Verify Email
          </a>
        </div>

        <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 20px 0 0;">
          This link will expire in <strong>24 hours</strong>.
        </p>

        <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 12px 0 0;">
          If you didn't create an account, please ignore this email.
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
