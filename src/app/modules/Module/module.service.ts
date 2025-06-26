import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Module } from "@prisma/client";

const createModule = async (payload: Module): Promise<Module> => {
  // Check if the course exists
  const course = await prisma.course.findUnique({
    where: { id: payload.courseId },
  });
  
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
  }

  // Get the current highest order for modules in this course
  const highestOrderModule = await prisma.module.findFirst({
    where: { courseId: payload.courseId },
    orderBy: { order: 'desc' },
  });

  const order = highestOrderModule ? highestOrderModule.order + 1 : 1;

  const result = await prisma.module.create({
    data: {
      ...payload,
      order,
    },
  });
  return result;
};

const getAllModules = async (): Promise<Module[]> => {
  const result = await prisma.module.findMany({
    include: {
      videos: true,
      course: true,
    },
    orderBy: {
      order: 'asc',
    },
  });
  return result;
};

const getModuleById = async (id: string): Promise<Module | null> => {
  const result = await prisma.module.findUnique({
    where: {
      id,
    },
    include: {
      videos: true,
      course: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Module not found");
  }

  return result;
};

const updateModule = async (
  id: string,
  payload: Partial<Module>
): Promise<Module> => {
  const result = await prisma.module.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteModule = async (id: string): Promise<Module> => {
  const result = await prisma.module.delete({
    where: {
      id,
    },
  });

  return result;
};

const getModulesByCourseId = async (courseId: string): Promise<Module[]> => {
  const result = await prisma.module.findMany({
    where: {
      courseId,
    },
    include: {
      videos: true,
    },
    orderBy: {
      order: 'asc',
    },
  });
  return result;
};

const reorderModules = async (courseId: string, newOrder: string[]): Promise<void> => {
  await prisma.$transaction(async (prisma) => {
    for (let i = 0; i < newOrder.length; i++) {
      const moduleId = newOrder[i];
      await prisma.module.update({
        where: { id: moduleId },
        data: { order: i + 1 },
      });
    }
  });
};

export const ModuleService = {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
  getModulesByCourseId,
  reorderModules,
};