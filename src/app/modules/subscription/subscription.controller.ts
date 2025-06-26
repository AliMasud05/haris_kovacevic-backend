import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SubscriptionService } from "./subscription.service";

const subscribe = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await SubscriptionService.subscribe(email);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Subscribed successfully",
    data: result,
  });
});

const getAllSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.getAllSubscriptions();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Subscriptions retrieved successfully",
    data: result,
  });
});

const unsubscribe = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await SubscriptionService.unsubscribe(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Unsubscribed successfully",
    data: result,
  });
});

export const SubscriptionController = {
  subscribe,
  getAllSubscriptions,
  unsubscribe,
};