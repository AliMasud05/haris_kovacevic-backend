import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { SubscriptionController } from "./subscription.controller";

const router = express.Router();

// Public routes
router.post("/", SubscriptionController.subscribe);
// router.post("/unsubscribe", SubscriptionController.unsubscribe);

// Admin only route
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SubscriptionController.getAllSubscriptions
);
//unsubscribe
router.delete(
  "/:id",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SubscriptionController.unsubscribe
);

export const SubscriptionRoutes = router;