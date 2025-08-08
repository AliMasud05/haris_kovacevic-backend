import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import emailSender from "../Auth/emailSender";
import { welcomeHtml } from "../../utils/welcomeMail";
import prisma from "../../../shared/prisma";
import { EmailService } from "./success.service";
import { IUploadFile } from "../../../interfaces/file";
import ApiError from "../../../errors/ApiErrors";



const sendWelcomeEmail = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    console.log(userId,req.body,"success controller");
    const result = await EmailService.sendWelcomeEmail(userId,req.body);

//     const result =await prisma.$transaction
//     const { courseName,email,userId } = req.body;
//     const user = await transa.user.findUnique({
//       where: {
//         id: userId,
//       },
//     });
//   const result = await emailSender(
//     " Welcome to hk-academy – Your Journey Begins!",email,
//     welcomeHtml(courseName,email,user.name)
//   );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Subscriptions retrieved successfully",
    data: result,
  });
});
const sendBroadcastEmail = catchAsync(async (req: Request, res: Response) => {
  // Validate required fields
  if (!req.body.subject || !req.body.message) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Subject and message are required"
    );
  }

  const userId = req.user.id;

  // Handle files conversion
  let files: Express.Multer.File[] = [];
  if (req.files) {
    files = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files).flat();
  }

  const result = await EmailService.sendBroadcastEmail(
    userId,
    {
      subject: req.body.subject,
      message: req.body.message,
    },
    files
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Broadcast email sent successfully",
    data: result,
  });
});


export const EmailController = {
  sendWelcomeEmail,
  sendBroadcastEmail,
};
