import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { IncludedController } from "./included.controller";
import validateRequest from "../../middlewares/validateRequest";
import { IncludedValidation } from "./included.validation";

const router = express.Router();

router.post(
  "/",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  validateRequest(IncludedValidation.createIncludedValidationSchema),
  IncludedController.createIncluded
);

router.get("/", IncludedController.getAllIncluded);
router.get("/:id", IncludedController.getIncludedById);
router.get("/resource/:resourceId", IncludedController.getIncludedByResourceId);

router.patch(
  "/:id",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  validateRequest(IncludedValidation.updateIncludedValidationSchema),
  IncludedController.updateIncluded
);

router.delete(
  "/:id",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  IncludedController.deleteIncluded
);

export const IncludedRoutes = router;