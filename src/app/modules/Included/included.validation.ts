import { z } from "zod";

const createIncludedValidationSchema = z.object({
  comment: z.string().min(3).max(1000),
  resourceId: z.string().uuid(),
});

const updateIncludedValidationSchema = z.object({
  comment: z.string().min(3).max(1000).optional(),
  resourceId: z.string().uuid().optional(),
});

export const IncludedValidation = {
  createIncludedValidationSchema,
  updateIncludedValidationSchema,
};