import { Enrollment } from './../../../../node_modules/.prisma/client/index.d';
//create strip payment service

import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { stripe } from "../../utils/stripe";
import { paymentStatusEnum } from "@prisma/client";

interface EnrollmentPayload {
  userId: string;
  courseId: string;
  paymentMethodId: string;

}

const createStripPayment = async (payload: EnrollmentPayload) => {
  // Start a transaction block to handle database operations
  const transaction = await prisma.$transaction(async (prisma) => {
    // Fetch the cart for the given user ID and include the related cart items and their products
    const course = await prisma.course.findFirst({
      where: { id: payload.courseId },
    });

    if (!course) {
      throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
    }

    

    // Create the order data
    const EnrollmentData = {
      userId: payload.userId,
      courseId: payload.courseId,
      Amount: course.price,      
    };

    // Create the enrollment
    const enrollment = await prisma.enrollment.create({
      data: EnrollmentData,
    });



    // Now create the Stripe PaymentIntent (this is the step that interacts with Stripe)
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(course.price * 100), // Stripe expects the amount in the smallest unit (e.g., cents)
        currency: "usd",
        payment_method: payload.paymentMethodId,
        description: `Payment for course ${course.id}`,
        confirm: true,
        off_session: true,
      });

      // Only create the payment record in the database after the Stripe payment is successful
      const payment = await prisma.payment.create({
        data: {
          courseId: course.id,
          paymentMethod: "Stripe",
          paymentStatus: paymentStatusEnum.SUCCEEDED,
          paymentAmount: course.price,
          transactionId: paymentIntent.id,
          userId: payload.userId,
        },
      });

      // Update the enrollment status to "Paid" after successful payment
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { paymentStatus: paymentStatusEnum.SUCCEEDED },
        
      });

      // // Delete the cart items since they've been successfully ordered
      // await prisma.cartItem.deleteMany({
      //   where: { cartId: cart.id },
      // });

      // Return the payment, order, order items, and payment intent in the transaction scope
      return { payment };
    } catch (stripeError: any) {
      // If Stripe fails, rollback everything, including the order and order items
      throw new Error(`Stripe payment failed: ${stripeError.message}`);
    }
  });

  return transaction;
};

export const StripePaymentService = {
  createStripPayment,
};
