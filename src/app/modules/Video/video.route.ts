// src/modules/video/video.routes.ts
import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { VideoController } from "./video.controller";

const router = express.Router();

router.post(
  "/",
//   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  VideoController.createVideo
);

router.get("/", VideoController.getAllVideos);
router.get("/:id", VideoController.getVideoById);
router.get("/module/:moduleId", VideoController.getVideosByModule);

router.patch(
  "/:id",
//   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  VideoController.updateVideo
);

router.delete(
  "/:id",
//   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  VideoController.deleteVideo
);

export const VideoRoutes = router;