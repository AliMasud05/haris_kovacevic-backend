import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Refund } from "@prisma/client";
import { addHours, isBefore } from "date-fns";

const createRefund = async (payload: Refund): Promise<Refund> => {
  // Check if the enrollment exists
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: payload.enrollmentId },
  });

  if (!enrollment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Enrollment not found");
  }

  // Check if the user is the owner of the enrollment
  if (enrollment.userId !== payload.userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to request a refund for this enrollment"
    );
  }

  // Check if enrollment is within 24 hours
  const enrollmentTime = enrollment.enrolledAt;
  const twentyFourHoursLater = addHours(enrollmentTime, 24);
  const currentTime = new Date();

  if (!isBefore(currentTime, twentyFourHoursLater)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You are not eligible for a refund as the enrollment is older than 24 hours"
    );
  }

  // Check if refund already exists for this enrollment
  const existingRefund = await prisma.refund.findFirst({
    where: { enrollmentId: payload.enrollmentId },
  });

  if (existingRefund) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Refund already requested for this enrollment"
    );
  }

  // Create the refund
  const result = await prisma.refund.create({
    data: payload,
  });

  return result;
};

const getAllRefunds = async (): Promise<Refund[]> => {
  const result = await prisma.refund.findMany({
    include: {

      enrollment: {
        include: {
          course: true,
          user: true,
          
        },
      },
    },
  });
  return result;
};

const getRefundById = async (id: string): Promise<Refund | null> => {
  const result = await prisma.refund.findUnique({
    where: { id },
    include: {

      enrollment: {
        include: {
          course: true,
          user: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Refund not found");
  }

  return result;
};

const getRefundsByUserId = async (userId: string): Promise<Refund[]> => {
  const result = await prisma.refund.findMany({
    where: { userId },
    include: {
      enrollment: {
        include: {
          course: true,
        },
      },
    },
  });
  return result;
};

export const RefundService = {
  createRefund,
  getAllRefunds,
  getRefundById,
  getRefundsByUserId,
};
