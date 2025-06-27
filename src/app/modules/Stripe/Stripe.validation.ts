import { z } from "zod";

// Define schema for Order with custom error messages
export const OrderSchema = z.object({
  paymentMethodId: z
    .string()
    .min(1, { message: "Payment Method ID is required" }),

  courseId: z.string().min(1, { message: "Course ID is required" }),
  userId: z.string().min(1, { message: "User ID is required" })

});

// Define schema for OrderItem with custom error messages
const OrderItemSchema = z.object({
  productId: z.string().min(1, { message: "Product ID is required" }),
  quantity: z
    .number()
    .int()
    .positive({ message: "Quantity must be a positive integer" }),
});

// Define schema for OrderData with custom error messages
export const OrderDataSchema = z.object({
  order: OrderSchema,
  orderItems: z
    .array(OrderItemSchema)
    .min(1, { message: "At least one order item is required" }),
});
