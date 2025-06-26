import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN, ),
  ReviewController.createReview
);

router.get("/", ReviewController.getAllReviews);
router.get("/:id", ReviewController.getReviewById);
router.get("/course/:courseId", ReviewController.getReviewsByCourseId);
router.get("/user/:userId", ReviewController.getReviewsByUserId);

router.patch(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  ReviewController.updateReview
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN,),
  ReviewController.deleteReview
);

export const ReviewRoutes = router;