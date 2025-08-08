import { z } from "zod";

const createLearningDataValidationSchema = z.object({
  comment: z.string().min(3).max(1000),
  order: z.number().int().min(0).optional(),
  courseId: z.string().uuid(),
});

const updateLearningDataValidationSchema = z.object({
  comment: z.string().min(3).max(1000).optional(),
  order: z.number().int().min(0).optional(),
  courseId: z.string().uuid().optional(),
});

export const LearningDataValidation = {
  createLearningDataValidationSchema,
  updateLearningDataValidationSchema,
};