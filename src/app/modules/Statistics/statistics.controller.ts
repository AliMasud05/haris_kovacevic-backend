import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatisticsService } from "./statistics.service";

const getRecentPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await StatisticsService.getRecentPayments();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Recent payments retrieved successfully",
    data: result,
  });
});

const getTopSellingCourses = catchAsync(async (req: Request, res: Response) => {
  const { limit } = req.query;
  const result = await StatisticsService.getTopSellingCourses(
    limit ? Number(limit) : undefined
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Top selling courses retrieved successfully",
    data: result,
  });
});

const getSalesReport = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const result = await StatisticsService.getSalesReport(
    startDate as string,
    endDate as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Sales report generated successfully",
    data: result,
  });
});

const getMonthlySales = catchAsync(async (req: Request, res: Response) => {
  const { months } = req.query;
  const result = await StatisticsService.getMonthlySales(
    months ? Number(months) : undefined
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Monthly sales data retrieved successfully",
    data: result,
  });
});
const getUserRegistrationStats = catchAsync(async (req: Request, res: Response) => {
  const result = await StatisticsService.getUserRegistrationStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User registration statistics retrieved successfully",
    data: result,
  });
});
const getCourseSalesReport = catchAsync(async (req: Request, res: Response) => {
  const result = await StatisticsService.getCourseSalesReport();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Sales statistics retrieved successfully",
    data: result,
  });
});

export const StatisticsController = {
  getRecentPayments,
  getTopSellingCourses,
  getSalesReport,
  getMonthlySales,
  getUserRegistrationStats,
  getCourseSalesReport,
};