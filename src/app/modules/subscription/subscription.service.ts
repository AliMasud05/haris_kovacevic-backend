import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Prisma, Subscription } from "@prisma/client";

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

const unsubscribe = async (id: string): Promise<Subscription> => {
   try {
     // Attempt to delete the subscription
     const result = await prisma.subscription.delete({
       where: { id },
     });

     // Return the deleted subscription
     return result;
   } catch (error) {
     // Handle the case where the subscription was not found
     if (
       error instanceof Prisma.PrismaClientKnownRequestError &&
       error.code === "P2025"
     ) {
       throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");
     }

     // Re-throw other unexpected errors
     throw error;
   }
};

//delete a subscription
// const deleteSubscription = async (id: string): Promise<Subscription> => {
//   try {
//     // Attempt to delete the subscription
//     const result = await prisma.subscription.delete({
//       where: { id },
//     });

 

//     // Return the deleted subscription
//     return result;
//   } catch (error) {
//     // Handle the case where the subscription was not found
//     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
//       throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");
//     }

//     // Re-throw other unexpected errors
//     throw error;
//   }
// };

export const SubscriptionService = {
  subscribe,
  getAllSubscriptions,
  unsubscribe,
};