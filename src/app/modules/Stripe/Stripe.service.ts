import { Enrollment } from "./../../../../node_modules/.prisma/client/index.d";
//create strip payment service

import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { stripe } from "../../utils/stripe";
import { paymentStatusEnum, Resource } from "@prisma/client";
import { capturePayPalOrder, createPayPalOrder, verifyPaypalPayment } from "../../utils/paypal";

interface EnrollmentPayload {
  userId: string;
  courseId: string;
  paymentMethodId?: string;
  paypalOrderId?: string;
}

const createStripPayment = async (userId: string, payload: any) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Start a transaction block to handle database operations
  const transaction = await prisma.$transaction(async (prisma) => {
    // Fetch the cart for the given user ID and include the related cart items and their products
    const course = await prisma.course.findFirst({
      where: { id: payload.courseId },
    });

    if (!course) {
      throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
    }
    // Check if the user is already enrolled in the course
    const uniqueEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: payload.courseId,
        },
      },
    });
    if (uniqueEnrollment) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Course already enrolled");
    }

    // Create the order data
    const EnrollmentData = {
      userId: payload.userId,
      courseId: payload.courseId,
      Amount: payload.amount,
      discount: course.discount,
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
          paymentAmount: payload.amount,
          transactionId: paymentIntent.id,
          userId: payload.userId,
        },
      });

      // Update the enrollment status to "Paid" after successful payment
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { paymentStatus: paymentStatusEnum.SUCCEEDED },
      });

      return { 
        payment, 
        name: user.name,
        email: user.email,
        street:user.street,
        city:user.city,
        postcode:user.postalCode,
        houseNumber:user.houseNumber,
        courseName: course.title,
        discount: course.discount,
       };
    } catch (stripeError: any) {
      // If Stripe fails, rollback everything, including the order and order items
      throw new Error(`Stripe payment failed: ${stripeError.message}`);
    }
  });

  return transaction;
};


//paypal payment
const createPaypalPayment = async (
  userId: string,
  courseId: string,
  amount: number
): Promise<any> => {

  console.log(userId, courseId);
  // Start a transaction block to handle database operations
  const transaction = await prisma.$transaction(async (prisma) => {
    // Fetch the cart for the given user ID and include the related cart items and their products
    const course = await prisma.course.findFirst({
      where: { id: courseId }, // Fixed: directly use courseId as the value for id
    });

    if (!course) {
      throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
    }

    // Create the order data
    const EnrollmentData = {
      userId: userId,
      courseId: courseId,
      Amount: amount,
    };

    // Create the enrollment
    const enrollment = await prisma.enrollment.create({
      data: EnrollmentData,
    });

    const paypalOrder = await createPayPalOrder(
     amount.toString(),
      userId
    );

    // Only create the payment record in the database after the Stripe payment is successful
    await prisma.payment.create({
      data: {
        courseId: course.id,
        paymentMethod: "PayPal",
        paymentStatus: "SUCCEEDED",
        paymentAmount: amount,
        transactionId: paypalOrder.orderId,
        userId: userId,
      },
    });

    // Update the enrollment status to "Paid" after successful payment
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { paymentStatus: "SUCCEEDED" },
    });

    return { paypalOrder };
  });

  return transaction;
};
const createResourceStripPayment = async (payload: any) => {
  // Start a transaction block to handle database operations
  const transaction = await prisma.$transaction(async (prisma) => {
    // Fetch the cart for the given user ID and include the related cart items and their products
    const resource = await prisma.resource.findFirst({
      where: { id: payload.resourceId },
    });

    if (!resource) {
      throw new ApiError(httpStatus.NOT_FOUND, "Resource not found");
    }

    const price = Number(resource.price);
    if (isNaN(price) || price <= 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Resource price must be a positive number"
      );
    }

    // Create the order data
    const EnrollmentData = {
      userId: payload.userId,
      resourceId: payload.resourceId,
      Amount: price,
    };

    // Create the enrollment
    const enrollment = await prisma.resourceEnrollment.create({
      data: EnrollmentData,
    });

    // Now create the Stripe PaymentIntent (this is the step that interacts with Stripe)
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(price * 100), // Stripe expects the amount in the smallest unit (e.g., cents)
        currency: "usd",
        payment_method: payload.paymentMethodId,
        description: `Payment for  ${resource.id}`,
        confirm: true,
        off_session: true,
      });

      // Only create the payment record in the database after the Stripe payment is successful
      const payment = await prisma.resoursePayment.create({
        data: {
          resourceId: resource.id,
          paymentMethod: "Stripe",
          paymentStatus: paymentStatusEnum.SUCCEEDED,
          paymentAmount: price,
          transactionId: paymentIntent.id,
          userId: payload.userId,
        },
      });

      // Update the enrollment status to "Paid" after successful payment
      await prisma.resourceEnrollment.update({
        where: { id: enrollment.id },
        data: { paymentStatus: paymentStatusEnum.SUCCEEDED },
      });

      return { payment };
    } catch (stripeError: any) {
      // If Stripe fails, rollback everything, including the order and order items
      throw new Error(`Stripe payment failed: ${stripeError.message}`);
    }
  });

  return transaction;
};
//paypal resource payment
const createPaypalResourcePayment = async (
  userId: string,
  resourceId: string
): Promise<any> => {

  // console.log(resourceId,"resourceId");
  
  // Start a transaction block to handle database operations
  const transaction = await prisma.$transaction(async (prisma) => {
    // Fetch the cart for the given user ID and include the related cart items and their products
    const resource = await prisma.resource.findFirst({
      where: { id: resourceId }, // Fixed: directly use courseId as the value for id
    });
    if (!resource) {
      throw new ApiError(httpStatus.NOT_FOUND, "Resource not found");
    }
    const price = Number(resource.price);
    if (isNaN(price) || price <= 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Resource price must be a positive number"
      );
    }
   

    // Create the order data
    const EnrollmentData = {
      userId: userId,
      resourceId: resourceId,
      Amount: price,
    };

    // Create the enrollment
    const enrollment = await prisma.resourceEnrollment.create({
      data: EnrollmentData,
    });


    const paypalOrder = await createPayPalOrder(
      price.toString(),
      userId
    );

    // Only create the payment record in the database after the Stripe payment is successful
    await prisma.resoursePayment.create({
      data: {
        resourceId: resource.id,
        paymentMethod: "PayPal",
        paymentStatus: "SUCCEEDED",
        paymentAmount: price,
        transactionId: paypalOrder.orderId,
        userId: userId,
      },
    });

    // Update the enrollment status to "Paid" after successful payment
    await prisma.resourceEnrollment.update({
      where: { id: enrollment.id },
      data: { paymentStatus: "SUCCEEDED" },
    });

    return { paypalOrder };
  });

  return transaction;
};
const createFreeCoursePayment = async (userId: string, payload: any) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Start a transaction block to handle database operations
  const transaction = await prisma.$transaction(async (prisma) => {
    // Fetch the cart for the given user ID and include the related cart items and their products
    const course = await prisma.course.findFirst({
      where: { id: payload.courseId },
    });

    if (!course) {
      throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
    }
    const uniqueEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: payload.courseId,
        },
      },
    });
    if (uniqueEnrollment) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Course already enrolled");
    }

    // Create the order data
    const EnrollmentData = {
      userId: userId,
      courseId: payload.courseId,
      Amount: 0,
    };

    // Create the enrollment
    const enrollment = await prisma.enrollment.create({
      data: EnrollmentData,
    });

    // Now create the Stripe PaymentIntent (this is the step that interacts with Stripe)
    try {
      

      // Only create the payment record in the database after the Stripe payment is successful
      const payment = await prisma.payment.create({
        data: {
          courseId: course.id,
          paymentMethod: "Stripe",
          paymentStatus: paymentStatusEnum.SUCCEEDED,
          paymentAmount: 0,
          transactionId: "free course",
          userId: userId,
        },
      });

      // Update the enrollment status to "Paid" after successful payment
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { paymentStatus: paymentStatusEnum.SUCCEEDED },
      });

      return {
        payment,
        name: user.name,
        email: user.email,
        street: user.street,
        city: user.city,
        postcode: user.postalCode,
        houseNumber: user.houseNumber,
        courseName: course.title,
      };
    } catch (stripeError: any) {
      // If Stripe fails, rollback everything, including the order and order items
      throw new Error(`Stripe payment failed: ${stripeError.message}`);
    }
  });

  return transaction;
};


export const StripePaymentService = {
  createStripPayment,
  createPaypalPayment,
  createResourceStripPayment,
  createPaypalResourcePayment,
  createFreeCoursePayment,
};
