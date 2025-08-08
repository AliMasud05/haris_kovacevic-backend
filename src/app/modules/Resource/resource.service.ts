import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import {
  Resource as PrismaResource,
  ResourceType,
  ResourceStatus,
} from "@prisma/client";

interface ResourceWithSize extends PrismaResource {
  fileSize?: string;
}

const createResource = async (
  payload: Omit<PrismaResource, "id" | "createdAt">
): Promise<PrismaResource> => {
  const result = await prisma.resource.create({
    data: payload,
  });
  return result;
};

const getAllResources = async (): Promise<PrismaResource[]> => {
  const result = await prisma.resource.findMany({
    select: {
      id: true,
      title: true,
      topic: true,
      type: true,
      status: true,
      price: true,
      thumbnail: true,
      included: true,
      file: true,
      uses: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

async function getFileSizeFromUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (response.ok) {
      const size = response.headers.get("Content-Length");
      return size ? formatFileSize(parseInt(size)) : null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching file size:", error);
    return null;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

const getResourceById = async (
  id: string
): Promise<ResourceWithSize | null> => {
  const result = await prisma.resource.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      topic: true,
      type: true,
      status: true,
      price: true,
      thumbnail: true,
      included: true,
      file: true,
      uses: true,
      createdAt: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Resource not found");
  }

  // Get file URL from result
  const fileUrl = result.file;

  // Add file size if URL exists
  if (fileUrl) {
    try {
      const fileSize = await getFileSizeFromUrl(fileUrl);
      return {
        ...result,
        fileSize: fileSize || "Unknown size",
      };
    } catch (error) {
      console.error("Failed to get file size:", error);
      return {
        ...result,
        fileSize: "Size unavailable",
      };
    }
  }

  return result;
};

const updateResource = async (
  id: string,
  payload: Partial<Omit<PrismaResource, "id" | "createdAt">>
): Promise<PrismaResource> => {
  // Check if resource exists
  const existingResource = await prisma.resource.findUnique({
    where: { id },
  });

  if (!existingResource) {
    throw new ApiError(httpStatus.NOT_FOUND, "Resource not found");
  }

  const result = await prisma.resource.update({
    where: { id },
    data: payload,
    select: {
      id: true,
      title: true,
      topic: true,
      type: true,
      status: true,
      price: true,
      thumbnail: true,
      included: true,
      file: true,
      uses: true,
      createdAt: true,
    },
  });
  return result;
};

const deleteResource = async (id: string): Promise<PrismaResource> => {
  const result = await prisma.resource.delete({
    where: { id },
    select: {
      id: true,
      title: true,
      topic: true,
      type: true,
      status: true,
      price: true,
      thumbnail: true,
      included: true,
      file: true,
      uses: true,
      createdAt: true,
    },
  });
  return result;
};

const getResourcesByType = async (
  type: ResourceType
): Promise<PrismaResource[]> => {
  const result = await prisma.resource.findMany({
    where: { type },
    select: {
      id: true,
      title: true,
      topic: true,
      type: true,
      status: true,
      price: true,
      thumbnail: true,
      included: true,
      file: true,
      uses: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getResourcesByStatus = async (
  status: ResourceStatus
): Promise<PrismaResource[]> => {
  const result = await prisma.resource.findMany({
    where: { status },
    select: {
      id: true,
      title: true,
      topic: true,
      type: true,
      status: true,
      price: true,
      thumbnail: true,
      included: true,
      file: true,
      uses: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

export const ResourceService = {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
  getResourcesByType,
  getResourcesByStatus,
};
