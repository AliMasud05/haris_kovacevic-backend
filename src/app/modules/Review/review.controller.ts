import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReview(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getAllReviews();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.getReviewById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Review retrieved successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.updateReview(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.deleteReview(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Review deleted successfully",
    data: result,
  });
});

const getReviewsByCourseId = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const result = await ReviewService.getReviewsByCourseId(courseId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Reviews retrieved by course ID successfully",
    data: result,
  });
});

const getReviewsByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await ReviewService.getReviewsByUserId(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Reviews retrieved by user ID successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsByCourseId,
  getReviewsByUserId,
};