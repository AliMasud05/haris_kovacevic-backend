import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { LearningDataController } from "./learningData.controller";
import validateRequest from "../../middlewares/validateRequest";
import { LearningDataValidation } from "./learningData.validation";

const router = express.Router();

router.post(
  "/",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(LearningDataValidation.createLearningDataValidationSchema),
  LearningDataController.createLearningData
);

router.get("/", LearningDataController.getAllLearningData);
router.get("/:id", LearningDataController.getLearningDataById);
router.get("/course/:courseId", LearningDataController.getLearningDataByCourseId);

router.patch(
  "/:id",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(LearningDataValidation.updateLearningDataValidationSchema),
  LearningDataController.updateLearningData
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  LearningDataController.deleteLearningData
);

export const LearningDataRoutes = router;