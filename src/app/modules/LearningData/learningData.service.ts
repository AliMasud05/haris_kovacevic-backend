import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { LearningData } from "@prisma/client";

const createLearningData = async (payload: LearningData): Promise<LearningData> => {
  const result = await prisma.learningData.create({
    data: payload,
  });
  return result;
};

const getAllLearningData = async (): Promise<LearningData[]> => {
  const result = await prisma.learningData.findMany({
    orderBy: {
      order: 'asc',
    },
    include: {
      course: true,
    },
  });
  return result;
};

const getLearningDataById = async (id: string): Promise<LearningData | null> => {
  const result = await prisma.learningData.findUnique({
    where: { id },
    include: {
      course: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Learning data not found");
  }

  return result;
};

const updateLearningData = async (
  id: string,
  payload: Partial<LearningData>
): Promise<LearningData> => {
  const existingData = await prisma.learningData.findUnique({
    where: { id },
  });

  if (!existingData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Learning data not found");
  }

  const result = await prisma.learningData.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteLearningData = async (id: string): Promise<LearningData> => {
  const result = await prisma.learningData.delete({
    where: { id },
  });
  return result;
};

const getLearningDataByCourseId = async (courseId: string): Promise<LearningData[]> => {
  const result = await prisma.learningData.findMany({
    where: { courseId },
    orderBy: {
      order: 'asc',
    },
    include: {
      course: true,
    },
  });
  return result;
};

export const LearningDataService = {
  createLearningData,
  getAllLearningData,
  getLearningDataById,
  updateLearningData,
  deleteLearningData,
  getLearningDataByCourseId,
};