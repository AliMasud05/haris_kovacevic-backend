import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { MyResume } from "@prisma/client";

const createResume = async (payload: MyResume): Promise<MyResume> => {
  const result = await prisma.myResume.create({
    data: payload,
  });
  return result;
};

const getAllResumes = async (): Promise<MyResume[]> => {
  const result = await prisma.myResume.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getResumeById = async (id: string): Promise<MyResume | null> => {
  const result = await prisma.myResume.findUnique({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Resume not found");
  }

  return result;
};

const updateResume = async (
  id: string,
  payload: Partial<MyResume>
): Promise<MyResume> => {
  const result = await prisma.myResume.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteResume = async (id: string): Promise<MyResume> => {
  const result = await prisma.myResume.delete({
    where: { id },
  });
  return result;
};
const getRecentResume = async (): Promise<MyResume> => {
  const result = await prisma.myResume.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "No resumes found");
  }

  return result;
};

export const MyResumeService = {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
  getRecentResume,
};
