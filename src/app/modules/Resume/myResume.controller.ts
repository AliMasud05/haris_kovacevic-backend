import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { MyResumeService } from "./myResume.service";

const createResume = catchAsync(async (req: Request, res: Response) => {
  const result = await MyResumeService.createResume(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Resume created successfully",
    data: result,
  });
});

const getAllResumes = catchAsync(async (req: Request, res: Response) => {
  const result = await MyResumeService.getAllResumes();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Resumes retrieved successfully",
    data: result,
  });
});

const getResumeById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MyResumeService.getResumeById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Resume retrieved successfully",
    data: result,
  });
});

const updateResume = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MyResumeService.updateResume(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Resume updated successfully",
    data: result,
  });
});

const deleteResume = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MyResumeService.deleteResume(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Resume deleted successfully",
    data: result,
  });
});
const getRecentResume = catchAsync(async (req: Request, res: Response) => {
  const result = await MyResumeService.getRecentResume();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Most recent resume retrieved successfully",
    data: result,
  });
});

export const MyResumeController = {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
  getRecentResume,
};
