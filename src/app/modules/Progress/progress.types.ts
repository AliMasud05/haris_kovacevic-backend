export interface VideoProgress {
  videoId: string;
  progress: number;
  isCompleted: boolean;
  lastWatched: string;
}

export interface ModuleProgress {
  moduleId: string;
  moduleName: string;
  completed: number;
  total: number;
  progress: number;
  videos: VideoProgress[];
}

export interface ProgressResponse {
  enrollmentId: string;
  courseId: string;
  courseName: string;
  overallProgress: number;
  completedVideos: number;
  totalVideos: number;
  moduleProgress: ModuleProgress[];
  recentProgress: VideoProgress[];
  lastWatched: string | null;
}

export interface CompletionPercentageResponse {
  courseId: string;
  userId: string;
  completionPercentage: number;
  completedVideos: number;
  totalVideos: number;
  lastWatched: string | null;
}

export interface RecentWatchedResponse {
  id: string;
  video: {
    id: string;
    title: string;
    duration: number;
    order: number;
    module: {
      id: string;
      title: string;
      order: number;
    };
  };
  enrollment: {
    id: string;
    course: {
      id: string;
      title: string;
      thumbnail?: string;
    };
  };
  progress: number;
  isCompleted: boolean;
  lastWatched: string;
}
