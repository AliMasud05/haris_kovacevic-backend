// src/modules/videoResource/videoResource.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { VideoResourceService } from "./videoResource.service";

const createVideoResource = catchAsync(async (req: Request, res: Response) => {
  const result = await VideoResourceService.createVideoResource(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Video resource created successfully",
    data: result,
  });
});

const getAllVideoResources = catchAsync(async (req: Request, res: Response) => {
  const result = await VideoResourceService.getAllVideoResources();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Video resources retrieved successfully",
    data: result,
  });
});

const getVideoResourceById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VideoResourceService.getVideoResourceById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Video resource retrieved successfully",
    data: result,
  });
});

const updateVideoResource = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VideoResourceService.updateVideoResource(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Video resource updated successfully",
    data: result,
  });
});

const deleteVideoResource = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VideoResourceService.deleteVideoResource(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Video resource deleted successfully",
    data: result,
  });
});

const getVideoResourcesByVideo = catchAsync(async (req: Request, res: Response) => {
  const { videoId } = req.params;
  const result = await VideoResourceService.getVideoResourcesByVideo(videoId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Video resources retrieved by video successfully",
    data: result,
  });
});

export const VideoResourceController = {
  createVideoResource,
  getAllVideoResources,
  getVideoResourceById,
  updateVideoResource,
  deleteVideoResource,
  getVideoResourcesByVideo,
};