import { z } from "zod";

const createModuleValidationSchema = z.object({
  title: z.string().min(3).max(255),
  courseId: z.string().uuid(),
});

const updateModuleValidationSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  courseId: z.string().uuid().optional(),
});

const reorderModulesValidationSchema = z.object({
  newOrder: z.array(z.string().uuid()).nonempty(),
});

export const ModuleValidation = {
  createModuleValidationSchema,
  updateModuleValidationSchema,
  reorderModulesValidationSchema,
};