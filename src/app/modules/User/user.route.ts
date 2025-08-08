import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// *!register user
router.post(
  "/register",
  userController.createUser
);
// *!get all  user
router.get("/", userController.getUsers);

// *!get user by id
router.get(
  "/:id",
  userController.getUserById
);

// *!profile user
router.put(
  "/profile",
  // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  userController.updateProfile
);

// *!update  user
router.put("/:id",  userController.updateUser);
router.post("/resend-otp", userController.resendOtp);



export const userRoutes = router;
