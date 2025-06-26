import { z } from "zod";

const createReviewValidationSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(500),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
});

const updateReviewValidationSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(3).max(500).optional(),
  userId: z.string().uuid().optional(),
  courseId: z.string().uuid().optional(),
});

export const ReviewValidation = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
};