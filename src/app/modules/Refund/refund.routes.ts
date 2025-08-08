import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { RefundController } from "./refund.controller";
import validateRequest from "../../middlewares/validateRequest";
import { RefundValidation } from "./refund.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER),
  // validateRequest(RefundValidation.createRefundValidationSchema),
  RefundController.createRefund
);

router.get(
  "/",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  RefundController.getAllRefunds
);

router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  RefundController.getRefundById
);

router.get(
  "/user/:userId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  RefundController.getRefundsByUserId
);

export const RefundRoutes = router;
