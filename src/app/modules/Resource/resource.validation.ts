import { z } from "zod";
import { ResourceType } from "@prisma/client";

const createResourceValidationSchema = z.object({
  name: z.string().min(3).max(255),
  type: z.nativeEnum(ResourceType),
  url: z.string().url(),
  courseId: z.string().uuid(),
});

const updateResourceValidationSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  type: z.nativeEnum(ResourceType).optional(),
  url: z.string().url().optional(),
  courseId: z.string().uuid().optional(),
});

export const ResourceValidation = {
  createResourceValidationSchema,
  updateResourceValidationSchema,
};