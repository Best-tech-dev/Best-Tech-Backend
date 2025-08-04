import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';
import { otpVerificationCodeTemplate } from './email.template';
import { contactUsSubmissionTemplate } from './contact-us-submission';
import { CreateContactUsDto } from '../contact-us/dto/create-contact-us.dto';
import { welcomeEmailTemplate } from './welcome-email';

export const sendOTPByEmail = async (email: string, otp: string): Promise<void> => {
    try {

        // Check if env vars exist (optional but recommended)
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            throw new Error("SMTP credentials missing in environment variables");
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: process.env.GOOGLE_SMTP_HOST,
            port: process.env.GOOGLE_SMTP_PORT ? parseInt(process.env.GOOGLE_SMTP_PORT) : 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const otpExpiresAt = "5 minutes";
        const htmlContent = otpVerificationCodeTemplate(email, otp, otpExpiresAt);

        const mailOptions = {
            from: {
                name: "Best Technologies LTD",
                address: process.env.EMAIL_USER as string,
            },
            to: email,
            subject: `Sign In Confirmation Code: ${otp}`,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending otp email:', error);
        throw new Error('Failed to send OTP email');
    }
};

export const sendContactUsNotification = async (
    adminEmails: string[],
    submissionData: CreateContactUsDto,
    submissionId: string
): Promise<void> => {
    try {
        // Check if env vars exist
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            throw new Error("SMTP credentials missing in environment variables");
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: process.env.GOOGLE_SMTP_HOST,
            port: process.env.GOOGLE_SMTP_PORT ? parseInt(process.env.GOOGLE_SMTP_PORT) : 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const htmlContent = contactUsSubmissionTemplate(submissionData, submissionId);

        const mailOptions = {
            from: {
                name: "Best Technologies LTD - Contact Us",
                address: process.env.EMAIL_USER as string,
            },
            to: adminEmails.join(', '),
            subject: `🆕 New Contact Us Submission - ${submissionData.fullName}`,
            html: htmlContent
        };

            await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending contact us notification email:', error);
    throw new Error('Failed to send contact us notification email');
  }
};

export const sendWelcomeEmail = async (
  email: string,
  firstName: string,
  lastName: string
): Promise<void> => {
  try {
    // Check if env vars exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error("SMTP credentials missing in environment variables");
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.GOOGLE_SMTP_HOST,
      port: process.env.GOOGLE_SMTP_PORT ? parseInt(process.env.GOOGLE_SMTP_PORT) : 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const htmlContent = welcomeEmailTemplate(firstName, lastName, email);

    const mailOptions = {
      from: {
        name: "Best Technologies Limited",
        address: process.env.EMAIL_USER as string,
      },
      to: email,
      subject: `🎉 Welcome to Best Technologies Limited, ${firstName}!`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};