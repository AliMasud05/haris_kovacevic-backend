// Image.service: Module file for the Image.service functionality.
import { PrismaClient } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { Request } from "express";
import { uploadFile } from "../../../helpers/uploadFile";
import { deleteFromDigitalOceanAWS, deleteMultipleFromDigitalOceanAWS, uploadToDigitalOceanAWS } from "../../../helpers/uploadToDigitalOceanAWS";



const createFile = async (req: Request) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No file provided");
  }

  const file = req.file;

  let fileUrl = (await uploadFile(file!, "file")).Location;



  return { fileUrl };
};

// Service for creating files
const createFiles = async (req: Request) => {
  const files = req.files as any[];
  if (!files || files.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No files provided");
  }

  const fileUrls = [];

  for (let file of files) {
    let url = (await uploadFile(file, "files")).Location;

    // const file = await prisma.file.create({
    //   data: {
    //     url,
    //     altText: file.originalname,
    //   },
    // });

    fileUrls.push(url);
  }

  for (let file of files) {
    let url = (await uploadFile(file, "files")).Location;

    // const file = await prisma.file.create({
    //   data: {
    //     url,
    //     altText: file.originalname,
    //   },
    // });

    fileUrls.push(url);
  }

  return { fileUrls };
};

const getFileById = async (id: string) => {
  const file = await prisma.file.findUnique({
    where: { id },
  });
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, "file not found");
  }
  return file;
};

const updateFile = async (id: string, req: Request) => {
  const file = req.file;
  let url;
  if (file) {
    url = (await uploadToDigitalOceanAWS(file.buffer, file.mimetype, file.originalname)).Location;
  }

  const updatedFile = await prisma.file.update({
    where: { id },
    data: {
      url,
      altText: req.body.altText,
    },
  });
  return updatedFile;
};

const deleteFile = async (payload: { url: string }) => {
  if (!payload.url) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No file provided");
  }
  const result = deleteFromDigitalOceanAWS(payload.url);
  return result;
};


const deleteMultipleFiles = async (urls: string[]) => {
  if (!urls || urls.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No files provided for deletion");
  }

  const result = deleteMultipleFromDigitalOceanAWS(urls)
    
 return result
};

export const FileService = {
  createFile,
  createFiles,
  getFileById,
  updateFile,
  deleteFile,
  deleteMultipleFiles
};
