/* eslint-disable no-console */
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { Readable } from "stream";
import ApiError from "../errors/ApiErrors";
import httpStatus from "http-status";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

interface UploadResponse {
  Location: string;
}

const s3Client = new S3Client({
  region: "us-east-1", // Set any valid region
  endpoint: process.env.DO_SPACE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DO_SPACE_ACCESS_KEY!,
    secretAccessKey: process.env.DO_SPACE_SECRET_KEY!,
  },
});

export const uploadToDigitalOceanAWS = async (
  buffer: Buffer,
  mimetype: string,
  fileName: string
): Promise<{ Location: string }> => {
  try {
    if (!buffer) {
      throw new ApiError(400, "File buffer is missing");
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${fileName}`;

    // Prepare the upload command
    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACE_BUCKET!,
      Key: uniqueFileName,
      Body: buffer,
      ACL: "public-read",
      ContentType: mimetype,
    });

    await s3Client.send(command);

    // Construct the direct URL to the uploaded file
    const Location = `${process.env.DO_SPACE_ENDPOINT}/${process.env.DO_SPACE_BUCKET}/${uniqueFileName}`;

    return { Location };
  } catch (error: any) {
    console.error(`Error uploading file: ${error.message}`);
    throw new ApiError(400, error.message);
  }
};




export const deleteFromDigitalOceanAWS = async (
  fileUrl: string
): Promise<void> => {
  try {
    if (typeof fileUrl !== "string") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Invalid URL format: ${fileUrl}`
      );
    }

    // Extract the file key from the URL
    const key = fileUrl.replace(
      `${process.env.DO_SPACE_ENDPOINT}/${process.env.DO_SPACE_BUCKET}/`,
      ""
    );

    // Prepare the delete command
    const command = new DeleteObjectCommand({
      Bucket: process.env.DO_SPACE_BUCKET!,
      Key: key,
    });

    await s3Client.send(command);

    console.log(`Successfully deleted file: ${fileUrl}`);
  } catch (error: any) {
    console.error(`Error deleting file: ${fileUrl}`, error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to delete file: ${error?.message}`
    );
  }
};


//delete multiple image url
export const deleteMultipleFromDigitalOceanAWS = async (
  fileUrls: string[]
): Promise<void> => {
  try {
    if (!Array.isArray(fileUrls) || fileUrls.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "No file URLs provided");
    }

    // Extract file keys from URLs
    const objectKeys = fileUrls.map((fileUrl) =>
      fileUrl.replace(
        `${process.env.DO_SPACE_ENDPOINT}/${process.env.DO_SPACE_BUCKET}/`,
        ""
      )
    );

    // Prepare the delete command for multiple objects
    const command = new DeleteObjectsCommand({
      Bucket: process.env.DO_SPACE_BUCKET!,
      Delete: {
        Objects: objectKeys.map((Key) => ({ Key })),
      },
    });

    await s3Client.send(command);

    // console.log(`Successfully deleted files:`, fileUrls);
  } catch (error: any) {
    console.error(`Error deleting files:`, error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to delete files: ${error?.message}`
    );
  }
};