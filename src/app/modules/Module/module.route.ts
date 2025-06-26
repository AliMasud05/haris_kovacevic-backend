import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ModuleController } from "./module.controller";

const router = express.Router();

router.post(
  "/",
//   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ModuleController.createModule
);

router.get("/", ModuleController.getAllModules);
router.get("/:id", ModuleController.getModuleById);
router.get("/course/:courseId", ModuleController.getModulesByCourseId);

router.patch(
  "/:id",
//   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ModuleController.updateModule
);

router.patch(
  "/reorder/:courseId",
//   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ModuleController.reorderModules
);

router.delete(
  "/:id",
//   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ModuleController.deleteModule
);

export const ModuleRoutes = router;