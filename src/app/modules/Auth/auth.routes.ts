import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// user login route
router.post(
  "/login",
  AuthController.loginUser
);

// user logout route
router.post("/logout", AuthController.logoutUser);

router.get(
  "/profile",
  auth(),
  AuthController.getMyProfile
);
router.get(
  "/profile-with-progress",
  auth(),
  AuthController.getMyProfileWithProgress
);

router.put(
  "/change-password",
  auth(),
  AuthController.changePassword
);


router.post(
  '/forgot-password',
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  AuthController.resetPassword
)
router.post(
  '/verify-otp',
  AuthController.verifyOtp
)
router.post("/google-login", AuthController.loginWithGoogle);


export const AuthRoutes = router;
