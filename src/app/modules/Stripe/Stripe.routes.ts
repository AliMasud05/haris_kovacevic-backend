// Stripe.routes: Module file for the Stripe.routes functionality.
import express from "express";
import { StripeController } from "./Stripe.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { OrderDataSchema, OrderSchema } from "./Stripe.validation";
const router = express.Router();

// Route to create a new stripe payment
router.post(
  "/stripe",
  auth(),
  validateRequest(OrderSchema),
  StripeController.createStripPayment
);
router.post(
  "/resource-payment",
  auth(),
  // validateRequest(OrderSchema),
  StripeController.createResourceStripPayment
);

//paypal payment
router.post(
  "/paypal",
  auth(),

  StripeController.createPaypalPayment
);
//paypal resource payment
router.post(
  "/paypal/resource-payment",
  auth(),

  StripeController.createPaypalResourcePayment
);
// payment without amount (for free courses)
router.post(
  "/free-course",
  auth(),
  // validateRequest(OrderDataSchema),
  StripeController.createFreeCoursePayment
);
export const StripePaymentRoutes = router;
