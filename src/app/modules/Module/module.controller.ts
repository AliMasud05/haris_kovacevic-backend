import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ModuleService } from "./module.service";

const createModule = catchAsync(async (req: Request, res: Response) => {
  const result = await ModuleService.createModule(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Module created successfully",
    data: result,
  });
});

const getAllModules = catchAsync(async (req: Request, res: Response) => {
  const result = await ModuleService.getAllModules();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Modules retrieved successfully",
    data: result,
  });
});

const getModuleById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ModuleService.getModuleById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Module retrieved successfully",
    data: result,
  });
});

const updateModule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ModuleService.updateModule(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Module updated successfully",
    data: result,
  });
});

const deleteModule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ModuleService.deleteModule(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Module deleted successfully",
    data: result,
  });
});

const getModulesByCourseId = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const result = await ModuleService.getModulesByCourseId(courseId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Modules retrieved by course ID successfully",
    data: result,
  });
});

const reorderModules = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { newOrder } = req.body;
  await ModuleService.reorderModules(courseId, newOrder);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Modules reordered successfully",
    data: null,
  });
});

export const ModuleController = {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
  getModulesByCourseId,
  reorderModules,
};