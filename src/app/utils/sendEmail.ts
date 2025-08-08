import config from "../../config";
import nodemailer from 'nodemailer';
import { IUploadFile } from "../../interfaces/file";

export const sendEmail = async (subject: string, to: string, html: string, files?: IUploadFile[]) => {
  try {
    console.log("Creating transporter with config:", {
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: config.brevo_email,
        pass: config.brevo_pass,
      },
    });

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: config.brevo_email,
        pass: config.brevo_pass,
      },
    });

    const mailOptions = {
      from: `"Support Team" <${config.email}>`,
      to,
      subject,
      text: html.replace(/<[^>]+>/g, ""),
      html,
      attachments: files?.map((file) => ({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype,
      })),
    };

    console.log("Attempting to send email with options:", {
      ...mailOptions,
      html: "...", // Don't log full HTML
    });

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info.messageId;
  } catch (error) {
    console.error("Detailed email error:", error); // Log full error
    throw new Error("Failed to send email. Please try again later.");
  }
};
