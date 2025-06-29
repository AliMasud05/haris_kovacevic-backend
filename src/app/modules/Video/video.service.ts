// src/modules/video/video.service.ts
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Video } from "@prisma/client";

const createVideo = async (payload: Video): Promise<Video> => {
  // Check if the module exists
  const moduleExists = await prisma.module.findUnique({
    where: { id: payload.moduleId },
  });

  if (!moduleExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Module not found");
  }

  // Check if the order is already taken in this module
  const existingVideoWithOrder = await prisma.video.findFirst({
    where: {
      moduleId: payload.moduleId,
      order: payload.order,
    },
  });

  if (existingVideoWithOrder) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "A video with this order already exists in this module"
    );
  }

  const result = await prisma.video.create({
    data: payload,
  });
  return result;
};

const getAllVideos = async (): Promise<Video[]> => {
  const result = await prisma.video.findMany({
    include: {
      module: true,
      videoResources: true,
    },
  });
  return result;
};

const getVideoById = async (id: string): Promise<Video | null> => {
  const result = await prisma.video.findUnique({
    where: {
      id,
    },
    include: {
      module: true,
      videoResources: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
  }

  return result;
};

const updateVideo = async (
  id: string,
  payload: Partial<Video>
): Promise<Video> => {
  // If order is being updated, check for conflicts
  if (payload.order !== undefined) {
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
    }

    const existingVideoWithOrder = await prisma.video.findFirst({
      where: {
        moduleId: video.moduleId,
        order: payload.order,
        NOT: {
          id: id,
        },
      },
    });

    if (existingVideoWithOrder) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "A video with this order already exists in this module"
      );
    }
  }

  const result = await prisma.video.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteVideo = async (id: string): Promise<Video> => {
  const result = await prisma.video.delete({
    where: {
      id,
    },
  });

  return result;
};

const getVideosByModule = async (moduleId: string): Promise<Video[]> => {
  const moduleExists = await prisma.module.findUnique({
    where: { id: moduleId },
  });

  if (!moduleExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Module not found");
  }

  const result = await prisma.video.findMany({
    where: {
      moduleId,
    },
    include: {
      module: true,
      videoResources: true,
    },
    orderBy: {
      order: "asc",
    },
  });
  return result;
};

export const VideoService = {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  getVideosByModule,
};