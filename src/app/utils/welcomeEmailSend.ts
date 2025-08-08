import nodemailer from "nodemailer";
import { welcomeHtml } from './welcomeMail';


const emailSender = async (subject: string, email: string, welcomeHtml: any) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "fbelalhossain2072@gmail.com",
      pass: "lszc hjyv kfqf dtif",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"Haris Kovačević " <hariskovacevi@gmail.com >',
    to: email,
    subject: `${subject}`,
    html:welcomeHtml,
  });

  console.log("Message sent: %s", info.messageId);
};

export default emailSender;
