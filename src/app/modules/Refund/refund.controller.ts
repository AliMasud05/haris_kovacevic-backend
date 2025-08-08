import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { RefundService } from "./refund.service";

const createRefund = catchAsync(async (req: Request, res: Response) => {
  const result = await RefundService.createRefund(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Refund requested successfully",
    data: result,
  });
});

const getAllRefunds = catchAsync(async (req: Request, res: Response) => {
  const result = await RefundService.getAllRefunds();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Refunds retrieved successfully",
    data: result,
  });
});

const getRefundById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await RefundService.getRefundById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Refund retrieved successfully",
    data: result,
  });
});

const getRefundsByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await RefundService.getRefundsByUserId(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User refunds retrieved successfully",
    data: result,
  });
});

export const RefundController = {
  createRefund,
  getAllRefunds,
  getRefundById,
  getRefundsByUserId,
};
