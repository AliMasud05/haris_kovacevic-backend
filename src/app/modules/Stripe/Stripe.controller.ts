// Stripe.controller: Module file for the Stripe.controller functionality.

import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { StripePaymentService } from "./Stripe.service";


// Delete a review by ID
const createStripPayment = catchAsync(async (req: Request, res: Response) => {
   
    const result = await StripePaymentService.createStripPayment(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Payment successful!",
      data: result,
    });
  });

export const StripeController = {
    createStripPayment
};