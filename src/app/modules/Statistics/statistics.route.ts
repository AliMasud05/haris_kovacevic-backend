import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { StatisticsController } from "./statistics.controller";

const router = express.Router();

router.get(
  "/recent-payments",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  StatisticsController.getRecentPayments
);

router.get(
  "/top-courses",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  StatisticsController.getTopSellingCourses
);

router.get(
  "/sales-report",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  StatisticsController.getSalesReport
);
router.get(
  "/monthly-sales",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  StatisticsController.getMonthlySales
);
router.get(
  "/user-registrations",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  StatisticsController.getUserRegistrationStats
);
router.get(
  "/course-sales-report",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  StatisticsController.getCourseSalesReport
);

export const StatisticsRoutes = router;