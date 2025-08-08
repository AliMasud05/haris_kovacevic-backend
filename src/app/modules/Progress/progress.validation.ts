import { z } from "zod";

const createProgressSchema = z.object({
  body: z.object({
    userId: z
      .string({
        required_error: "User ID is required",
      })
      .uuid("Invalid user ID format"),

    videoId: z
      .string({
        required_error: "Video ID is required",
      })
      .uuid("Invalid video ID format"),

    enrollmentId: z
      .string({
        required_error: "Enrollment ID is required",
      })
      .uuid("Invalid enrollment ID format"),

    progress: z
      .number({
        required_error: "Progress is required",
      })
      .int("Progress must be an integer")
      .min(0, "Progress cannot be negative")
      .max(100, "Progress cannot exceed 100%"),

    isCompleted: z.boolean().optional().default(false),
  }),
});

const updateProgressSchema = z.object({
  body: z
    .object({
      userId: z.string().uuid("Invalid user ID format").optional(),
      videoId: z.string().uuid("Invalid video ID format").optional(),
      enrollmentId: z.string().uuid("Invalid enrollment ID format").optional(),

      progress: z
        .number()
        .int("Progress must be an integer")
        .min(0, "Progress cannot be negative")
        .max(100, "Progress cannot exceed 100%")
        .optional(),

      isCompleted: z.boolean().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "At least one field must be provided for update"
    ),
});

const getProgressByUserAndVideoSchema = z.object({
  params: z.object({
    userId: z
      .string({
        required_error: "User ID is required",
      })
      .uuid("Invalid user ID format"),

    videoId: z
      .string({
        required_error: "Video ID is required",
      })
      .uuid("Invalid video ID format"),

    enrollmentId: z
      .string({
        required_error: "Enrollment ID is required",
      })
      .uuid("Invalid enrollment ID format"),
  }),
});

const getUserProgressSchema = z.object({
  params: z.object({
    userId: z
      .string({
        required_error: "User ID is required",
      })
      .uuid("Invalid user ID format"),
  }),
  query: z.object({
    enrollmentId: z.string().uuid("Invalid enrollment ID format").optional(),
  }),
});

const getEnrollmentProgressSchema = z.object({
  params: z.object({
    enrollmentId: z
      .string({
        required_error: "Enrollment ID is required",
      })
      .uuid("Invalid enrollment ID format"),
  }),
});

const getCourseProgressSummarySchema = z.object({
  params: z.object({
    userId: z
      .string({
        required_error: "User ID is required",
      })
      .uuid("Invalid user ID format"),

    enrollmentId: z
      .string({
        required_error: "Enrollment ID is required",
      })
      .uuid("Invalid enrollment ID format"),
  }),
});

const deleteProgressSchema = z.object({
  params: z.object({
    id: z
      .string({
        required_error: "Progress ID is required",
      })
      .uuid("Invalid progress ID format"),
  }),
});

const resetUserProgressSchema = z.object({
  params: z.object({
    userId: z
      .string({
        required_error: "User ID is required",
      })
      .uuid("Invalid user ID format"),

    enrollmentId: z
      .string({
        required_error: "Enrollment ID is required",
      })
      .uuid("Invalid enrollment ID format"),
  }),
});

const myProgressQuerySchema = z.object({
  query: z.object({
    enrollmentId: z.string().uuid("Invalid enrollment ID format").optional(),
  }),
});

const myProgressUpdateSchema = z.object({
  body: z.object({
    videoId: z
      .string({
        required_error: "Video ID is required",
      })
      .uuid("Invalid video ID format"),

    enrollmentId: z
      .string({
        required_error: "Enrollment ID is required",
      })
      .uuid("Invalid enrollment ID format"),

    progress: z
      .number({
        required_error: "Progress is required",
      })
      .int("Progress must be an integer")
      .min(0, "Progress cannot be negative")
      .max(100, "Progress cannot exceed 100%"),

    isCompleted: z.boolean().optional().default(false),
  }),
});

const myCourseProgressSummarySchema = z.object({
  params: z.object({
    enrollmentId: z
      .string({
        required_error: "Enrollment ID is required",
      })
      .uuid("Invalid enrollment ID format"),
  }),
});

export const ProgressValidation = {
  createProgressSchema,
  updateProgressSchema,
  getProgressByUserAndVideoSchema,
  getUserProgressSchema,
  getEnrollmentProgressSchema,
  getCourseProgressSummarySchema,
  deleteProgressSchema,
  resetUserProgressSchema,
  myProgressQuerySchema,
  myProgressUpdateSchema,
  myCourseProgressSummarySchema,
};
