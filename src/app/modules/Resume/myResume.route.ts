import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { MyResumeController } from "./myResume.controller";

const router = express.Router();

// Public routes
router.get("/", MyResumeController.getAllResumes);
router.get("/recent",
     MyResumeController.getRecentResume); // New route
router.get("/:id", MyResumeController.getResumeById);

// Protected routes (admin only)
router.post("/", 
    // auth(UserRole.ADMIN), 
    MyResumeController.createResume);
router.patch("/:id", auth(UserRole.ADMIN), MyResumeController.updateResume);
router.delete("/:id", auth(UserRole.ADMIN), MyResumeController.deleteResume);

export const MyResumeRoutes = router;
