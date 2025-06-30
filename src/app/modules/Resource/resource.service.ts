import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Resource, ResourceType, ResourceStatus } from "@prisma/client";

const createResource = async (payload: Resource): Promise<Resource> => {
  // Check if the course exists
  const course = await prisma.course.findUnique({
    where: { id: payload.courseId },
  });

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
  }

  const result = await prisma.resource.create({
    data: payload,
    include: {
      course: true,
    },
  });
  return result;
};

const getAllResources = async (): Promise<Resource[]> => {
  const result = await prisma.resource.findMany({
    include: {
      course: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return result;
};

const getResourceById = async (id: string): Promise<Resource | null> => {
  const result = await prisma.resource.findUnique({
    where: { id },
    include: { course: true },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Resource not found");
  }

  return result;
};

const updateResource = async (
  id: string,
  payload: Partial<Resource>
): Promise<Resource> => {
  // Check if resource exists
  const existingResource = await prisma.resource.findUnique({
    where: { id },
  });

  if (!existingResource) {
    throw new ApiError(httpStatus.NOT_FOUND, "Resource not found");
  }

  // If courseId is being updated, check if new course exists
  if (payload.courseId && payload.courseId !== existingResource.courseId) {
    const course = await prisma.course.findUnique({
      where: { id: payload.courseId },
    });
    if (!course) {
      throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
    }
  }

  const result = await prisma.resource.update({
    where: { id },
    data: payload,
    include: {
      course: true,
    },
  });
  return result;
};

const deleteResource = async (id: string): Promise<Resource> => {
  const result = await prisma.resource.delete({
    where: { id },
    include: {
      course: true,
    },
  });
  return result;
};

const getResourcesByCourseId = async (courseId: string): Promise<Resource[]> => {
  const result = await prisma.resource.findMany({
    where: { courseId },
    include: { course: true },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return result;
};

const getResourcesByType = async (type: ResourceType): Promise<Resource[]> => {
  const result = await prisma.resource.findMany({
    where: { type },
    include: { course: true },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return result;
};

const getResourcesByStatus = async (status: ResourceStatus): Promise<Resource[]> => {
  const result = await prisma.resource.findMany({
    where: { status },
    include: { course: true },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return result;
};

export const ResourceService = {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
  getResourcesByCourseId,
  getResourcesByType,
  getResourcesByStatus,
};