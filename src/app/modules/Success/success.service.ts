import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { welcomeHtml } from "../../utils/welcomeMail";

import config from "../../../config";
import { sendEmail } from "../../utils/sendEmail";
import { IUploadFile } from "../../../interfaces/file";

// const sendWelcomeEmail = async (userId: string,payload: any) => {
//     const { courseName } =payload;

//   const user = await prisma.user.findUnique({
//     where: {
//       id: userId,
//     },
//   });
//   console.log(user);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, "User not found");
//   }
//   const result = await emailSender(
//     " Welcome to hk-academy – Your Journey Begins!",user.email,
//     welcomeHtml(courseName,user.email,user.name)
//   );
  
//   return result;
// };

const sendWelcomeEmail = async (userId: string, payload: any) => {
  const { courseName } = payload;

  const adminEmail = config.admin_email || "contact@hk-academy.com";
  if (!adminEmail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin email not found");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  console.log(user, "user from sendWelcomeEmail");

  try {
    // Send welcome email to user
    await sendEmail(
      "Welcome to hk-academy – Your Journey Begins!", // subject
      user.email, // to
      `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to ${courseName}</h2>
        <p><strong>User:</strong> ${user.name} (${user.email})</p>
        <p><strong>Course:</strong> ${courseName}</p>
        <p>We're excited to have you on board!</p>
      </div>
      ` // html
    );

    // Send notification to admin
    await sendEmail(
      "New Course Purchase Notification", // subject
      adminEmail, // to
      `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New Course Purchase</h2>
        <p><strong>User:</strong> ${user.name} (${user.email})</p>
        <p><strong>Course:</strong> ${courseName}</p>
        <p>Please verify this purchase in the admin panel.</p>
      </div>
      ` // html
    );

    return { success: true, message: "Emails sent successfully" };
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "User enrolled but email notifications failed"
    );
  }
};
const sendBroadcastEmail = async (
  userId: string,
  payload: { subject: string; message: string },
  files?: Express.Multer.File[]
) => {
  // Validate payload
  if (!payload?.subject || !payload?.message) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Subject and message are required"
    );
  }

  // Verify admin user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Get all subscribers
  const subscribers = await prisma.subscription.findMany();

  if (subscribers.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No subscribers found");
  }

  try {
    // Prepare email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">${payload.subject}</h2>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
          ${payload.message.replace(/\n/g, "<br>")}
        </div>
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          You're receiving this email because you subscribed to our newsletter.
          <br>
          <a href="${
            config.frontend_url
          }/unsubscribe" style="color: #4f46e5;">Unsubscribe</a>
        </p>
      </div>
    `;

    // Send email to each subscriber (batched for large lists)
    const BATCH_SIZE = 10;
    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);
    const emailPromises = await Promise.all(
        batch.map((subscriber) =>
          sendEmail(payload.subject, subscriber.email, emailContent, files)
        )
      );
      console.log("Emails sent successfully", emailPromises);
    }
    console.log("Emails sent successfully", { subscribers });

    return {
      success: true,
      message: `Broadcast email sent to ${subscribers.length} subscribers`,
    };
  } catch (error) {
    console.error("Broadcast email failed:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to send broadcast email"
    );
  }
};
export const EmailService = {
  sendWelcomeEmail,
  sendBroadcastEmail,
};