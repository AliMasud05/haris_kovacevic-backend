import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ResourceService } from "./resource.service";
import { ResourceType, ResourceStatus } from "@prisma/client";

const createResource = catchAsync(async (req: Request, res: Response) => {
  const result = await ResourceService.createResource(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Resource created successfully",
    data: result,
  });
});

const getAllResources = catchAsync(async (req: Request, res: Response) => {
  const result = await ResourceService.getAllResources();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Resources retrieved successfully",
    data: result,
  });
});

const getResourceById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ResourceService.getResourceById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Resource retrieved successfully",
    data: result,
  });
});

const updateResource = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ResourceService.updateResource(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Resource updated successfully",
    data: result,
  });
});

const deleteResource = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ResourceService.deleteResource(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Resource deleted successfully",
    data: result,
  });
});

const getResourcesByCourseId = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const result = await ResourceService.getResourcesByCourseId(courseId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Resources retrieved by course ID successfully",
    data: result,
  });
});

const getResourcesByType = catchAsync(async (req: Request, res: Response) => {
  const { type } = req.params;
  const result = await ResourceService.getResourcesByType(type as ResourceType);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Resources retrieved by type successfully",
    data: result,
  });
});

const getResourcesByStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.params;
  const result = await ResourceService.getResourcesByStatus(status as ResourceStatus);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Resources retrieved by status successfully",
    data: result,
  });
});

export const ResourceController = {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
  getResourcesByCourseId,
  getResourcesByType,
  getResourcesByStatus,
};