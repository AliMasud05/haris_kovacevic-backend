import { z } from "zod";

const createResumeValidationSchema = z.object({
  url: z.string().url("Invalid URL format"),
});

const updateResumeValidationSchema = z.object({
  url: z.string().url("Invalid URL format").optional(),
});

export const MyResumeValidation = {
  createResumeValidationSchema,
  updateResumeValidationSchema,
};
