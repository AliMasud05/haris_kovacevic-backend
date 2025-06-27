// Stripe.routes: Module file for the Stripe.routes functionality.
import express from "express";
import { StripeController } from "./Stripe.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { OrderDataSchema, OrderSchema } from "./Stripe.validation";
const router = express.Router();


// Route to create a new stripe payment
router.post("/", auth(),validateRequest(OrderSchema), StripeController.createStripPayment);

export const StripePaymentRoutes = router;
