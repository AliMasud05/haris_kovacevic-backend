// src/modules/videoResource/videoResource.routes.ts
import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { VideoResourceController } from "./videoResource.controller";

const router = express.Router();

router.post(
  "/",
//   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  VideoResourceController.createVideoResource
);

router.get("/", VideoResourceController.getAllVideoResources);
router.get("/:id", VideoResourceController.getVideoResourceById);
router.get("/video/:videoId", VideoResourceController.getVideoResourcesByVideo);

router.patch(
  "/:id",
//   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  VideoResourceController.updateVideoResource
);

router.delete(
  "/:id",
//   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  VideoResourceController.deleteVideoResource
);

export const VideoResourceRoutes = router;