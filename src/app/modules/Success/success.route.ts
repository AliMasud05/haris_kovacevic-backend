import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { EmailController } from "./success.controller";
import { upload } from "../../utils/multer";

const router = express.Router();

router.post('/success', 
    auth(),   
    EmailController.sendWelcomeEmail      
  
);
router.post(
  "/broadcast",
  auth(),
  upload.any(), // or upload.fields([{ name: 'attachments', maxCount: 5 }])
  EmailController.sendBroadcastEmail
);

export const successRoutes = router;
