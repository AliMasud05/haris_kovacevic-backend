import { z } from "zod";

const createRefundValidationSchema = z.object({
  userId: z.string().uuid(),
  enrollmentId: z.string().uuid(),
  invoice: z.string().min(1, "Invoice is required"),
});

export const RefundValidation = {
  createRefundValidationSchema,
};
