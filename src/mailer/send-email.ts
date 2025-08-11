import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';
import { otpVerificationCodeTemplate } from './email.template';
import { contactUsSubmissionTemplate } from './contact-us-submission';
import { CreateContactUsDto } from '../contact-us/dto/create-contact-us.dto';
import { welcomeEmailTemplate } from './welcome-email';
import { contactUsUserConfirmationTemplate } from './contact-us-user-confirmation';
import { newsletterSubscriptionAdminTemplate, newsletterWelcomeTemplate } from './newsletter-subscription';
import { newsletterEmailTemplate } from './newsletter-template';

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

export const sendContactUsUserConfirmation = async (
  userEmail: string,
  submissionData: CreateContactUsDto,
  submissionId: string
): Promise<void> => {
  try {
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

    const htmlContent = contactUsUserConfirmationTemplate(submissionData, submissionId);

    const mailOptions = {
      from: {
        name: "Best Technologies LTD - Support",
        address: process.env.EMAIL_USER as string,
      },
      to: userEmail,
      subject: `✅ We Received Your Message — Reference ${submissionId}`,
      html: htmlContent,
    } as nodemailer.SendMailOptions;

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending contact us user confirmation email:', error);
    throw new Error('Failed to send contact us user confirmation email');
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

export const sendNewsletterSubscriptionAdminNotification = async (
  adminEmails: string[],
  subscriberEmail: string,
  subscriptionId: string,
  stats: {
    totalSubscribers: number;
    totalNewslettersSent: number;
    thisMonthSubscribers: number;
    thisWeekSubscribers: number;
    averageSubscribersPerMonth: number;
    topSubscriberDomains: string[];
  }
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

    const htmlContent = newsletterSubscriptionAdminTemplate(subscriberEmail, subscriptionId, stats);

    const mailOptions = {
      from: {
        name: "Best Technologies Limited - Newsletter",
        address: process.env.EMAIL_USER as string,
      },
      to: adminEmails.join(', '),
      subject: `📧 New Newsletter Subscription - ${subscriberEmail}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending newsletter subscription admin notification:', error);
    throw new Error('Failed to send newsletter subscription admin notification');
  }
};

export const sendNewsletterWelcomeEmail = async (
  email: string
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

    const htmlContent = newsletterWelcomeTemplate(email);

    const mailOptions = {
      from: {
        name: "Best Technologies Limited",
        address: process.env.EMAIL_USER as string,
      },
      to: email,
      subject: `🎉 Welcome to Our Newsletter!`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending newsletter welcome email:', error);
    throw new Error('Failed to send newsletter welcome email');
  }
};

interface NewsletterImage {
  publicId: string;
  secureUrl: string;
  alt?: string;
  caption?: string;
  order?: number;
}

export const sendNewsletterToSubscribers = async (
  subject: string,
  title: string,
  subtitle: string | null,
  body: string,
  images: NewsletterImage[] | null,
  subscriberEmails: string[],
  unsubscribeBaseUrl: string = 'http://localhost:3000/newsletter/unsubscribe'
): Promise<{ sent: number; failed: number }> => {
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

    let sentCount = 0;
    let failedCount = 0;

    // Send to each subscriber
    for (const email of subscriberEmails) {
      try {
        const unsubscribeUrl = `${unsubscribeBaseUrl}?email=${encodeURIComponent(email)}`;
        const htmlContent = newsletterEmailTemplate(
          subject,
          title,
          subtitle,
          body,
          images,
          unsubscribeUrl
        );

        const mailOptions = {
          from: {
            name: "Best Technologies Limited",
            address: process.env.EMAIL_USER as string,
          },
          to: email,
          subject: subject,
          html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        sentCount++;
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error sending newsletter to ${email}:`, error);
        failedCount++;
      }
    }

    return { sent: sentCount, failed: failedCount };
  } catch (error) {
    console.error('Error sending newsletter to subscribers:', error);
    throw new Error('Failed to send newsletter to subscribers');
  }
};