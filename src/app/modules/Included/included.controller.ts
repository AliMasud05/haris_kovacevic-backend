import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { includedService } from "./included.service";

const createIncluded = catchAsync(async (req: Request, res: Response) => {
  const result = await includedService.createincluded(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Included created successfully",
    data: result,
  });
});

const getAllIncluded = catchAsync(async (req: Request, res: Response) => {
  const result = await includedService.getAllincluded();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Included records retrieved successfully",
    data: result,
  });
});

const getIncludedById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await includedService.getincludedById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Included record retrieved successfully",
    data: result,
  });
});

const updateIncluded = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await includedService.updateincluded(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Included updated successfully",
    data: result,
  });
});

const deleteIncluded = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await includedService.deleteincluded(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Included deleted successfully",
    data: result,
  });
});

const getIncludedByResourceId = catchAsync(async (req: Request, res: Response) => {
  const { resourceId } = req.params;
  const result = await includedService.getincludedByResourceId(resourceId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Included records retrieved by resource ID successfully",
    data: result,
  });
});

export const IncludedController = {
  createIncluded,
  getAllIncluded,
  getIncludedById,
  updateIncluded,
  deleteIncluded,
  getIncludedByResourceId,
};