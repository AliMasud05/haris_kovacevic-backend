import { z } from "zod";

const createContactValidationSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  description: z.string().min(10).max(500),
});

const updateContactValidationSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  description: z.string().min(10).max(500).optional(),
});

export const ContactValidation = {
  createContactValidationSchema,
  updateContactValidationSchema,
};