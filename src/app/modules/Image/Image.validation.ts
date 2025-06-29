// Image.validation: Module file for the Image.validation functionality.
import * as z from "zod";

export const createImageSchema = z.object({
    body: z.object({
      file: z.string({
        required_error: " file is required"
      }).url("Invalid image URL")
    })
  });


const deleteMultipleFilesSchema = z.object({
      urls: z.array(
        z.string({
          required_error: "file URL is required"
        }).url("Invalid image URL")
      ).min(1, "At least one file URL is required")

  });

  export const FileValidation = {
    createImageSchema,
    deleteMultipleFilesSchema
  };