// src/modules/video/video.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { VideoService } from "./video.service";

const createVideo = catchAsync(async (req: Request, res: Response) => {
  const result = await VideoService.createVideo(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Video created successfully",
    data: result,
  });
});

const getAllVideos = catchAsync(async (req: Request, res: Response) => {
  const result = await VideoService.getAllVideos();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Videos retrieved successfully",
    data: result,
  });
});

const getVideoById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VideoService.getVideoById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Video retrieved successfully",
    data: result,
  });
});

const updateVideo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VideoService.updateVideo(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Video updated successfully",
    data: result,
  });
});

const deleteVideo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VideoService.deleteVideo(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Video deleted successfully",
    data: result,
  });
});

const getVideosByModule = catchAsync(async (req: Request, res: Response) => {
  const { moduleId } = req.params;
  const result = await VideoService.getVideosByModule(moduleId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Videos retrieved by module successfully",
    data: result,
  });
});

export const VideoController = {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  getVideosByModule,
};