// src/modules/videoResource/videoResource.service.ts
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { VideoResource } from "@prisma/client";

const createVideoResource = async (payload: VideoResource): Promise<VideoResource> => {
  // Check if the video exists
  const videoExists = await prisma.video.findUnique({
    where: { id: payload.videoId },
  });

  if (!videoExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
  }

  // Check if the order is already taken for this video
  const existingResourceWithOrder = await prisma.videoResource.findFirst({
    where: {
      videoId: payload.videoId,
      order: payload.order,
    },
  });

  if (existingResourceWithOrder) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "A resource with this order already exists for this video"
    );
  }

  const result = await prisma.videoResource.create({
    data: payload,
  });
  return result;
};

const getAllVideoResources = async (): Promise<VideoResource[]> => {
  const result = await prisma.videoResource.findMany({
    include: {
      video: true,
    },
  });
  return result;
};

const getVideoResourceById = async (id: string): Promise<VideoResource | null> => {
  const result = await prisma.videoResource.findUnique({
    where: {
      id,
    },
    include: {
      video: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Video resource not found");
  }

  return result;
};

const updateVideoResource = async (
  id: string,
  payload: Partial<VideoResource>
): Promise<VideoResource> => {
  // If order is being updated, check for conflicts
  if (payload.order !== undefined) {
    const resource = await prisma.videoResource.findUnique({
      where: { id },
    });

    if (!resource) {
      throw new ApiError(httpStatus.NOT_FOUND, "Video resource not found");
    }

    const existingResourceWithOrder = await prisma.videoResource.findFirst({
      where: {
        videoId: resource.videoId,
        order: payload.order,
        NOT: {
          id: id,
        },
      },
    });

    if (existingResourceWithOrder) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "A resource with this order already exists for this video"
      );
    }
  }

  const result = await prisma.videoResource.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteVideoResource = async (id: string): Promise<VideoResource> => {
  const result = await prisma.videoResource.delete({
    where: {
      id,
    },
  });

  return result;
};

const getVideoResourcesByVideo = async (videoId: string): Promise<VideoResource[]> => {
  const videoExists = await prisma.video.findUnique({
    where: { id: videoId },
  });

  if (!videoExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
  }

  const result = await prisma.videoResource.findMany({
    where: {
      videoId,
    },
    include: {
      video: true,
    },
    orderBy: {
      order: "asc",
    },
  });
  return result;
};

export const VideoResourceService = {
  createVideoResource,
  getAllVideoResources,
  getVideoResourceById,
  updateVideoResource,
  deleteVideoResource,
  getVideoResourcesByVideo,
};