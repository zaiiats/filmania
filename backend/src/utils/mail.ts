import { FRONTEND_URL } from "../constants";
import { transporter } from "../lib/mail";

export const HTMLTemplates = {
  verifyMail: ({
    email,
    code,
    fullVerifyEmail,
  }: {
    email: string;
    code: string;
    fullVerifyEmail: string;
  }) => {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; color: #111827;">
        <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; text-align: center;">Підтвердження пошти</h2>
        <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.5; color: #4b5563; text-align: center;">
          Ви отримали цей лист для підтвердження адреси <strong>${email}</strong>. Ваш код підтвердження:
        </p>
        
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 6px; padding: 12px 24px; background-color: #f3f4f6; border-radius: 6px; color: #1f2937;">
            ${code.toUpperCase()}
          </span>
        </div>

        <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.5; color: #4b5563; text-align: center;">
          Або просто натисніть кнопку нижче для швидкого підтвердження:
        </p>

        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${fullVerifyEmail}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 6px;">
            Підтвердити пошту
          </a>
        </div>

        <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 16px;">
          Якщо ви не реєструвалися в сервісі, просто проігноруйте цей лист.
        </p>
      </div>
    `;
  },
};

interface SendMailProps {
  email: string;
  subject: string;
  html: string;
}

export const sendMail = async ({ email, subject, html }: SendMailProps) => {
  await transporter.sendMail({
    from: "Filmania <zaacoleksandr890@gmail.com>",
    to: email,
    subject: subject,
    html: html,
  });
};

export const createVerifyEmailLink = ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  return `${FRONTEND_URL}/verify-email?code${code}?email=${email}`;
};
