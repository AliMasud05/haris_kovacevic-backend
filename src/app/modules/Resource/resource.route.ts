import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ResourceController } from "./resource.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ResourceController.createResource
);

router.get("/", ResourceController.getAllResources);
router.get("/:id", ResourceController.getResourceById);
router.get("/course/:courseId", ResourceController.getResourcesByCourseId);
router.get("/type/:type", ResourceController.getResourcesByType);
router.get("/status/:status", ResourceController.getResourcesByStatus);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ResourceController.updateResource
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ResourceController.deleteResource
);

export const ResourceRoutes = router;