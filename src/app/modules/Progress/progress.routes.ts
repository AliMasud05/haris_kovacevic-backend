import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ProgressController } from "./progress.controller";

const router = express.Router();

// Public/User routes (require authentication)
router.post(
  "/",
  // auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ProgressController.createOrUpdateProgress
);

// Current user's progress routes
router.get(
  "/my-progress",
  // auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ProgressController.getMyProgress
);

router.get(
  "/my-completed",
  // auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ProgressController.getMyCompletedVideos
);

router.get(
  "/my-course-summary/:enrollmentId",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ProgressController.getMyCourseProgressSummary
);

router.put(
  "/my-progress",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ProgressController.updateMyProgress
);

// Admin routes - specific progress record
router.get(
  "/user/:userId/video/:videoId/enrollment/:enrollmentId",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ProgressController.getProgressByUserAndVideo
);

router.delete(
  "/:id",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ProgressController.deleteProgress
);

// Admin routes - user management
router.get(
  "/user/:userId",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ProgressController.getProgressByUser
);

router.get(
  "/user/:userId/completed",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ProgressController.getCompletedVideosByUser
);

router.get(
  "/user/:userId/course-summary/:enrollmentId",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ProgressController.getCourseProgressSummary
);

router.delete(
  "/user/:userId/enrollment/:enrollmentId/reset",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ProgressController.resetUserProgress
);

// Admin routes - enrollment management
router.get(
  "/enrollment/:enrollmentId",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ProgressController.getProgressByEnrollment
);

export const ProgressRoutes = router;
