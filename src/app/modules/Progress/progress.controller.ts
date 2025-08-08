import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ProgressService } from "./progress.service";

const createOrUpdateProgress = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProgressService.createOrUpdateProgress(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Progress updated successfully",
      data: result,
    });
  }
);

const getProgressByUserAndVideo = catchAsync(
  async (req: Request, res: Response) => {
    const { userId, videoId, enrollmentId } = req.params;
    const result = await ProgressService.getProgressByUserAndVideo(
      userId,
      videoId,
      enrollmentId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Progress retrieved successfully",
      data: result,
    });
  }
);

const getProgressByUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { enrollmentId } = req.query;
  const result = await ProgressService.getProgressByUser(
    userId,
    enrollmentId as string | undefined
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User progress retrieved successfully",
    data: result,
  });
});

const getProgressByEnrollment = catchAsync(
  async (req: Request, res: Response) => {
    const { enrollmentId } = req.params;
    const result = await ProgressService.getProgressByEnrollment(enrollmentId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Enrollment progress retrieved successfully",
      data: result,
    });
  }
);

const getCompletedVideosByUser = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { enrollmentId } = req.query;
    const result = await ProgressService.getCompletedVideosByUser(
      userId,
      enrollmentId as string | undefined
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Completed videos retrieved successfully",
      data: result,
    });
  }
);

const getCourseProgressSummary = catchAsync(
  async (req: Request, res: Response) => {
    const { userId, enrollmentId } = req.params;
    const result = await ProgressService.getCourseProgressSummary(
      userId,
      enrollmentId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Course progress summary retrieved successfully",
      data: result,
    });
  }
);

const deleteProgress = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProgressService.deleteProgress(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Progress deleted successfully",
    data: result,
  });
});

const resetUserProgress = catchAsync(async (req: Request, res: Response) => {
  const { userId, enrollmentId } = req.params;
  const result = await ProgressService.resetUserProgress(userId, enrollmentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User progress reset successfully",
    data: result,
  });
});

// Get current user's progress (from JWT token)
const getMyProgress = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Assuming JWT payload contains userId
  const { enrollmentId } = req.query;

  const result = await ProgressService.getProgressByUser(
    userId,
    enrollmentId as string | undefined
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Your progress retrieved successfully",
    data: result,
  });
});

// Get current user's completed videos
const getMyCompletedVideos = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Assuming JWT payload contains userId
  const { enrollmentId } = req.query;

  const result = await ProgressService.getCompletedVideosByUser(
    userId,
    enrollmentId as string | undefined
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Your completed videos retrieved successfully",
    data: result,
  });
});

// Get current user's course progress summary
const getMyCourseProgressSummary = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId; // Assuming JWT payload contains userId
    const { enrollmentId } = req.params;

    const result = await ProgressService.getCourseProgressSummary(
      userId,
      enrollmentId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Your course progress summary retrieved successfully",
      data: result,
    });
  }
);

// Update current user's progress
const updateMyProgress = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Assuming JWT payload contains userId
  const progressData = {
    ...req.body,
    userId, // Override userId from JWT
  };

  const result = await ProgressService.createOrUpdateProgress(progressData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Your progress updated successfully",
    data: result,
  });
});

export const ProgressController = {
  createOrUpdateProgress,
  getProgressByUserAndVideo,
  getProgressByUser,
  getProgressByEnrollment,
  getCompletedVideosByUser,
  getCourseProgressSummary,
  deleteProgress,
  resetUserProgress,
  getMyProgress,
  getMyCompletedVideos,
  getMyCourseProgressSummary,
  updateMyProgress,
};
