// Stripe.controller: Module file for the Stripe.controller functionality.

import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { StripePaymentService } from "./Stripe.service";

// Delete a review by ID
const createStripPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  console.log(userId, req.body);
  const result = await StripePaymentService.createStripPayment(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Payment successful!",
    data: result,
  });
});
const createResourceStripPayment = catchAsync(
  async (req: Request, res: Response) => {
    const result = await StripePaymentService.createResourceStripPayment(
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Resource Payment successful!",
      data: result,
    });
  }
);

//paypal payment
const createPaypalPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const {courseId,amount} = req.body;
  const result = await StripePaymentService.createPaypalPayment(
    userId,
    courseId,
    amount
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Payment successful!",
    data: result
  });
});
//paypal resource payment
const createPaypalResourcePayment = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { resourceId } = req.body;
    console.log(resourceId,"resourceId");
    const result = await StripePaymentService.createPaypalResourcePayment(
      userId,
      resourceId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Resource Payment successful!",
      data: result,
    });
  }
);
const createFreeCoursePayment = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    console.log(userId, req.body);
    const result = await StripePaymentService.createFreeCoursePayment(
      userId,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Payment successful!",
      data: result,
    });
  }
);


export const StripeController = {
  createStripPayment,
  createPaypalPayment,
  createResourceStripPayment,
  createPaypalResourcePayment,
  createFreeCoursePayment,
};
