import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { included } from "@prisma/client";


const createincluded = async (payload: included): Promise<included> => {
  const result = await prisma.included.create({
    data: payload,
    include: {
      resource: true,
    },
  });
  return result;
};

const getAllincluded = async (): Promise<included[]> => {
  const result = await prisma.included.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      resource: true,
    },
  });
  return result;
};

const getincludedById = async (id: string): Promise<included | null> => {
  const result = await prisma.included.findUnique({
    where: { id },
    include: {
      resource: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "included record not found");
  }

  return result;
};

const updateincluded = async (
  id: string,
  payload: Partial<included>
): Promise<included> => {
  const existingData = await prisma.included.findUnique({
    where: { id },
  });

  if (!existingData) {
    throw new ApiError(httpStatus.NOT_FOUND, "included record not found");
  }

  const result = await prisma.included.update({
    where: { id },
    data: payload,
    include: {
      resource: true,
    },
  });
  return result;
};

const deleteincluded = async (id: string): Promise<included> => {
  const result = await prisma.included.delete({
    where: { id },
    include: {
      resource: true,
    },
  });
  return result;
};

const getincludedByResourceId = async (resourceId: string): Promise<included[]> => {
  const result = await prisma.included.findMany({
    where: { resourceId },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      resource: true,
    },
  });
  return result;
};

export const includedService = {
  createincluded,
  getAllincluded,
  getincludedById,
  updateincluded,
  deleteincluded,
  getincludedByResourceId,
};