/* eslint-disable no-console */
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import ApiError from "../errors/ApiErrors";
import httpStatus from "http-status";

dotenv.config();

const s3Client = new S3Client({
  region: process.env.DO_SPACE_REGION,
  endpoint: `https://${process.env.DO_SPACE_REGION}.digitaloceanspaces.com`, // ✅ Correct region endpoint
  credentials: {
    accessKeyId: process.env.DO_SPACE_ACCESS_KEY!,
    secretAccessKey: process.env.DO_SPACE_SECRET_KEY!,
  },
  forcePathStyle: false,
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

    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACE_BUCKET!,
      Key: uniqueFileName,
      Body: buffer,
      ACL: "public-read",
      ContentType: mimetype,
    });

    await s3Client.send(command);

    // ✅ Correct public URL
    const Location = `https://${process.env.DO_SPACE_BUCKET}.${process.env.DO_SPACE_REGION}.digitaloceanspaces.com/${uniqueFileName}`;

    return { Location };
  } catch (error: any) {
    console.error(`Error uploading file: ${error.message}`);
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
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

    // ✅ Extract key from full URL
    const key = fileUrl.replace(
      `https://${process.env.DO_SPACE_BUCKET}.${process.env.DO_SPACE_REGION}.digitaloceanspaces.com/`,
      ""
    );

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

export const deleteMultipleFromDigitalOceanAWS = async (
  fileUrls: string[]
): Promise<void> => {
  try {
    if (!Array.isArray(fileUrls) || fileUrls.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "No file URLs provided");
    }

    const objectKeys = fileUrls.map((fileUrl) =>
      fileUrl.replace(
        `https://${process.env.DO_SPACE_BUCKET}.${process.env.DO_SPACE_REGION}.digitaloceanspaces.com/`,
        ""
      )
    );

    const command = new DeleteObjectsCommand({
      Bucket: process.env.DO_SPACE_BUCKET!,
      Delete: {
        Objects: objectKeys.map((Key) => ({ Key })),
      },
    });

    await s3Client.send(command);
  } catch (error: any) {
    console.error(`Error deleting files:`, error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to delete files: ${error?.message}`
    );
  }
};
