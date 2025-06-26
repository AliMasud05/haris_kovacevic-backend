import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ContactController } from "./contact.controller";

const router = express.Router();

// Public route (no auth required)
router.post("/", ContactController.createContact);

// Protected routes (admin only)
router.get("/", auth(UserRole.ADMIN), ContactController.getAllContacts);
router.get("/:id", auth(UserRole.ADMIN), ContactController.getContactById);
router.patch("/:id", auth(UserRole.ADMIN), ContactController.updateContact);
router.delete("/:id", auth(UserRole.ADMIN), ContactController.deleteContact);

export const ContactRoutes = router;