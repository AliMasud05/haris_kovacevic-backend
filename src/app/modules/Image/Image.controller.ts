// Image.controller: Module file for the Image.controller functionality.
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { FileService } from "./Image.service";

// Controller for creating an image
const createFile = catchAsync(async (req: Request, res: Response) => {
  const result = await FileService.createFile(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "File Created successfully!",
    data: result,
  });
});

// Controller for creating files
const createFiles = catchAsync(async (req: Request, res: Response) => {
  const result = await FileService.createFiles(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Files Created successfully!",
    data: result,
  });
});

// Controller for getting a file by ID
const getFileById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const file = await FileService.getFileById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "File retrieved successfully",
    data: file,
  });
});

// Controller for updating a file
const updateFile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FileService.updateFile(id, req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "File updated successfully!",
    data: result,
  });
});

// Controller for deleting a file
const deleteFile = catchAsync(async (req: Request, res: Response) => {
  const result = await FileService.deleteFile(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "File deleted successfully!",
    data: result,
  });
});



//
const deleteMultipleFiles = catchAsync(async (req: Request, res: Response) => {
  const { urls } = req.body;
  const result = await FileService.deleteMultipleFiles(urls);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Files Deleted successfully",
    data: result
  });
});


export const FileController = {
  createFile,
  getFileById,
  updateFile,
  deleteFile,
  createFiles,
  deleteMultipleFiles
};
