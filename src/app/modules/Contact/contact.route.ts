import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ContactController } from "./contact.controller";

const router = express.Router();

// Public route (no auth required)
router.post("/", ContactController.createContact);

// Protected routes (admin only)
router.get("/",  ContactController.getAllContacts);
router.get("/:id", ContactController.getContactById);
router.patch("/:id",  ContactController.updateContact);
router.delete("/:id", ContactController.deleteContact);

export const ContactRoutes = router;