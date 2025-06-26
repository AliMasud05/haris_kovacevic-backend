import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Subscription } from "@prisma/client";

const subscribe = async (email: string): Promise<Subscription> => {
  // Check if email already exists
  const existingSubscription = await prisma.subscription.findFirst({
    where: { email },
  });

  if (existingSubscription) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already subscribed");
  }

  const result = await prisma.subscription.create({
    data: { email },
  });
  return result;
};

const getAllSubscriptions = async (): Promise<Subscription[]> => {
  return await prisma.subscription.findMany();
};

const unsubscribe = async (email: string): Promise<Subscription> => {
  const result = await prisma.subscription.deleteMany({
    where: { email },
  });

  if (result.count === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");
  }

  // Optionally, return the deleted email or a custom object
  return { email } as Subscription;
};

export const SubscriptionService = {
  subscribe,
  getAllSubscriptions,
  unsubscribe,
};