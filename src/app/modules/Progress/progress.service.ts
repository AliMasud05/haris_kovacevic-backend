import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Progress as PrismaProgress } from "@prisma/client";

type ProgressWithRelations = PrismaProgress & {
  user: {
    id: string;
    name: string;
    email: string;
  };
  video: {
    id: string;
    title: string;
    duration: number | null;
    order: number;
  };
  enrollment: {
    id: string;
    courseId: string;
  };
};

interface CreateProgressPayload {
  userId: string;
  videoId: string;
  enrollmentId: string;
  progress: number;
  isCompleted?: boolean;
}

interface UpdateProgressPayload {
  progress?: number;
  isCompleted?: boolean;
  lastWatched?: Date;
  completedAt?: Date;
}

const createOrUpdateProgress = async (
  payload: CreateProgressPayload
): Promise<ProgressWithRelations> => {
  const {
    userId,
    videoId,
    enrollmentId,
    progress,
    isCompleted = false,
  } = payload;

  // Check if progress record already exists
  const existingProgress = await prisma.progress.findUnique({
    where: {
      userId_videoId_enrollmentId: {
        userId,
        videoId,
        enrollmentId,
      },
    },
  });

  let result: PrismaProgress;

  if (existingProgress) {
    // Update existing progress
    const updateData: UpdateProgressPayload = {
      progress: Math.max(existingProgress.progress, progress),
      isCompleted: isCompleted || existingProgress.isCompleted,
      lastWatched: new Date(),
    };

    if (isCompleted && !existingProgress.isCompleted) {
      updateData.completedAt = new Date();
    }

    result = await prisma.progress.update({
      where: { id: existingProgress.id },
      data: updateData,
    });
  } else {
    // Create new progress record
    result = await prisma.progress.create({
      data: {
        userId,
        videoId,
        enrollmentId,
        progress,
        isCompleted,
        lastWatched: new Date(),
        completedAt: isCompleted ? new Date() : null,
      },
    });
  }

  // Fetch with relations
  const progressWithRelations = await prisma.progress.findUnique({
    where: { id: result.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      video: {
        select: {
          id: true,
          title: true,
          duration: true,
          order: true,
        },
      },
      enrollment: {
        select: {
          id: true,
          courseId: true,
        },
      },
    },
  });

  if (
    !progressWithRelations ||
    !progressWithRelations.user ||
    !progressWithRelations.video ||
    !progressWithRelations.enrollment
  ) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to fetch progress with relations"
    );
  }

  return progressWithRelations as ProgressWithRelations;
};

const getProgressByUserAndVideo = async (
  userId: string,
  videoId: string,
  enrollmentId: string
): Promise<ProgressWithRelations | null> => {
  const result = await prisma.progress.findUnique({
    where: {
      userId_videoId_enrollmentId: {
        userId,
        videoId,
        enrollmentId,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      video: {
        select: {
          id: true,
          title: true,
          duration: true,
          order: true,
        },
      },
      enrollment: {
        select: {
          id: true,
          courseId: true,
        },
      },
    },
  });

  if (!result) return null;
  return result as ProgressWithRelations;
};

const getProgressByUser = async (
  userId: string,
  enrollmentId?: string
): Promise<ProgressWithRelations[]> => {
  const whereClause: any = { userId };

  if (enrollmentId) {
    whereClause.enrollmentId = enrollmentId;
  }

  const results = await prisma.progress.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      video: {
        select: {
          id: true,
          title: true,
          duration: true,
          order: true,
        },
      },
      enrollment: {
        select: {
          id: true,
          courseId: true,
        },
      },
    },
    orderBy: {
      lastWatched: "desc",
    },
  });

  return results as ProgressWithRelations[];
};

const getProgressByEnrollment = async (
  enrollmentId: string
): Promise<ProgressWithRelations[]> => {
  const results = await prisma.progress.findMany({
    where: { enrollmentId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      video: {
        select: {
          id: true,
          title: true,
          duration: true,
          order: true,
        },
      },
      enrollment: {
        select: {
          id: true,
          courseId: true,
        },
      },
    },
    orderBy: [{ video: { order: "asc" } }, { lastWatched: "desc" }],
  });

  return results as ProgressWithRelations[];
};

const getCompletedVideosByUser = async (
  userId: string,
  enrollmentId?: string
): Promise<ProgressWithRelations[]> => {
  const whereClause: any = {
    userId,
    isCompleted: true,
  };

  if (enrollmentId) {
    whereClause.enrollmentId = enrollmentId;
  }

  const results = await prisma.progress.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      video: {
        select: {
          id: true,
          title: true,
          duration: true,
          order: true,
        },
      },
      enrollment: {
        select: {
          id: true,
          courseId: true,
        },
      },
    },
    orderBy: {
      completedAt: "desc",
    },
  });

  return results as ProgressWithRelations[];
};

const getCourseProgressSummary = async (
  userId: string,
  enrollmentId: string
): Promise<{
  totalVideos: number;
  completedVideos: number;
  inProgressVideos: number;
  overallProgress: number;
  lastWatched?: Date;
}> => {
  const progressRecords = await prisma.progress.findMany({
    where: {
      userId,
      enrollmentId,
    },
  });

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: {
        include: {
          modules: {
            include: {
              videos: true,
            },
          },
        },
      },
    },
  });

  if (!enrollment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Enrollment not found");
  }

  const totalVideos = enrollment.course.modules.reduce(
    (total, module) => total + module.videos.length,
    0
  );

  const completedVideos = progressRecords.filter((p) => p.isCompleted).length;
  const inProgressVideos = progressRecords.filter(
    (p) => !p.isCompleted && p.progress > 0
  ).length;

  const overallProgress =
    totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

  const lastWatched =
    progressRecords.length > 0
      ? progressRecords.reduce(
          (latest, current) =>
            current.lastWatched > latest ? current.lastWatched : latest,
          progressRecords[0].lastWatched
        )
      : undefined;

  return {
    totalVideos,
    completedVideos,
    inProgressVideos,
    overallProgress,
    lastWatched,
  };
};

const deleteProgress = async (id: string): Promise<ProgressWithRelations> => {
  const existingProgress = await prisma.progress.findUnique({
    where: { id },
  });

  if (!existingProgress) {
    throw new ApiError(httpStatus.NOT_FOUND, "Progress record not found");
  }

  const result = await prisma.progress.delete({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      video: {
        select: {
          id: true,
          title: true,
          duration: true,
          order: true,
        },
      },
      enrollment: {
        select: {
          id: true,
          courseId: true,
        },
      },
    },
  });

  return result as ProgressWithRelations;
};

const resetUserProgress = async (
  userId: string,
  enrollmentId: string
): Promise<{ deletedCount: number }> => {
  const result = await prisma.progress.deleteMany({
    where: {
      userId,
      enrollmentId,
    },
  });

  return { deletedCount: result.count };
};

export const ProgressService = {
  createOrUpdateProgress,
  getProgressByUserAndVideo,
  getProgressByUser,
  getProgressByEnrollment,
  getCompletedVideosByUser,
  getCourseProgressSummary,
  deleteProgress,
  resetUserProgress,
};
