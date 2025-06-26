import { z } from "zod";

const subscribeValidationSchema = z.object({
  email: z.string().email(),
});

const unsubscribeValidationSchema = z.object({
  email: z.string().email(),
});

export const SubscriptionValidation = {
  subscribeValidationSchema,
  unsubscribeValidationSchema,
};