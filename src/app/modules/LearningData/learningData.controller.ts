import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { LearningDataService } from "./learningData.service";

const createLearningData = catchAsync(async (req: Request, res: Response) => {
  const result = await LearningDataService.createLearningData(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Learning data created successfully",
    data: result,
  });
});

const getAllLearningData = catchAsync(async (req: Request, res: Response) => {
  const result = await LearningDataService.getAllLearningData();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Learning data retrieved successfully",
    data: result,
  });
});

const getLearningDataById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LearningDataService.getLearningDataById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Learning data retrieved successfully",
    data: result,
  });
});

const updateLearningData = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LearningDataService.updateLearningData(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Learning data updated successfully",
    data: result,
  });
});

const deleteLearningData = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LearningDataService.deleteLearningData(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Learning data deleted successfully",
    data: result,
  });
});

const getLearningDataByCourseId = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const result = await LearningDataService.getLearningDataByCourseId(courseId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Learning data retrieved by course ID successfully",
    data: result,
  });
});

export const LearningDataController = {
  createLearningData,
  getAllLearningData,
  getLearningDataById,
  updateLearningData,
  deleteLearningData,
  getLearningDataByCourseId,
};