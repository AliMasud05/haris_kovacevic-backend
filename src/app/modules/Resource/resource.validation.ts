import { z } from "zod";
import { ResourceType, ResourceStatus } from "@prisma/client";

const createResourceValidationSchema = z.object({
  title: z.string().min(3).max(255),
  topic: z.string().min(3).max(255),
  type: z.nativeEnum(ResourceType),
  status: z.nativeEnum(ResourceStatus),
  price: z.number().min(0).optional(),
  thumbnail: z.string().optional(),
  file: z.string(),
  courseId: z.string().uuid(),
});

const updateResourceValidationSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  topic: z.string().min(3).max(255).optional(),
  type: z.nativeEnum(ResourceType).optional(),
  status: z.nativeEnum(ResourceStatus).optional(),
  price: z.number().min(0).optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  file: z.string().optional(),
  courseId: z.string().uuid().optional(),
});

export const ResourceValidation = {
  createResourceValidationSchema,
  updateResourceValidationSchema,
};