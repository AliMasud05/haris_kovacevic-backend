// Image.routes: Module file for the Image.routes functionality.
import express from "express";
import { FileController } from "./Image.controller";
import validateRequest from "../../middlewares/validateRequest";
import { FileValidation } from "./Image.validation";
import { fileUploader } from "../../../helpers/fileUploader";

const router = express.Router();

// Create image route (POST)
router.post(
  "/single",
  fileUploader.upload.single("file"),
  FileController.createFile
);


// Create image route (POST)
router.post(
  "/multiple",
  fileUploader.upload.array("files"),
  FileController.createFiles
);

// Get image by ID route (GET)
// router.get("/:id", FileController.getImageById);

// // Update image by ID route (PUT)
// router.put("/:id", upload.single("file"), FileController.updateImage);

// Delete image by ID route (DELETE)
router.delete("/delete", FileController.deleteFile);



router.delete(
  "/bulk",
  validateRequest(FileValidation.deleteMultipleFilesSchema),
  FileController.deleteMultipleFiles
);
export const FileRoutes = router;
