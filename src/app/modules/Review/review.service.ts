import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Review } from "@prisma/client";

const createReview = async (payload: Review): Promise<Review> => {
  // Check if user and course exist
  const [user, course] = await Promise.all([
    prisma.user.findUnique({ where: { id: payload.userId } }),
    prisma.course.findUnique({ where: { id: payload.courseId } }),
  ]);

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  if (!course) throw new ApiError(httpStatus.NOT_FOUND, "Course not found");

  //check unique review based on userId and courseId
  const existingReview = await prisma.review.findFirst({
    where: {
      userId: payload.userId,
      courseId: payload.courseId,
    },
  });
  if (existingReview) throw new ApiError(httpStatus.BAD_REQUEST, "You already reviewed this course");

  // Check if rating is between 1-5
  if (payload.rating < 1 || payload.rating > 5) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
  }


  const result = await prisma.review.create({
    data: payload,
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true } },
    },
  });

  return result;
};

const getAllReviews = async (): Promise<Review[]> => {
  return await prisma.review.findMany({
    include: {
      user: { select: { id: true, name: true ,profileImage:true } },
      course: { select: { id: true, title: true } },
    },
  });
};

const getReviewById = async (id: string): Promise<Review | null> => {
  const result = await prisma.review.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true } },
      course: { select: { id: true, title: true } },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }

  return result;
};

const updateReview = async (
  id: string,
  payload: Partial<Review>
): Promise<Review> => {
  // Validate rating if being updated
  if (payload.rating && (payload.rating < 1 || payload.rating > 5)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
  }

  const result = await prisma.review.update({
    where: { id },
    data: payload,
    include: {
      user: { select: { id: true, name: true } },
      course: { select: { id: true, title: true } },
    },
  });

  return result;
};

const deleteReview = async (id: string): Promise<Review> => {
  const result = await prisma.review.delete({
    where: { id },
  });

  return result;
};

const getReviewsByCourseId = async (courseId: string): Promise<{ reviews: Review[]; averageRating: number }> => {
  const reviews = await prisma.review.findMany({
    where: { courseId },
    include: {
      user: { select: { id: true, name: true, profileImage: true } },
    },
  });

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
  // Round to 1 decimal place
  const roundedAverage = Math.round(averageRating * 10) / 10;

  return {
    reviews,
    averageRating: reviews.length > 0 ? roundedAverage : 0, // Handle case when there are no reviews
  };
};
const getReviewsByUserId = async (userId: string): Promise<Review[]> => {
  return await prisma.review.findMany({
    where: { userId },
    include: {
      course: { select: { id: true, title: true } },
    },
  });
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsByCourseId,
  getReviewsByUserId,
};