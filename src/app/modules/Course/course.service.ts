import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Course, CourseStatus, CourseType, SkillLevel } from "@prisma/client";

const createCourse = async (payload: Course): Promise<Course> => {
  const result = await prisma.course.create({
    data: payload,
  });
  return result;
};

const getAllCourses = async (): Promise<Course[]> => {
  const result = await prisma.course.findMany({
    include: {
      modules: {
        include: {
          videos: {
            include: {
              videoResources: true,
            },
          },
        },
      },
      enrollments: true,
      reviews: false,
    },
  });

  // Calculate discounted price for each course
  const coursesWithDiscount = result.map((course) => {
    console.log(course.price, course.discount);
    return {
      ...course,
      discountedPrice: course.price - (course.price * course.discount / 100),
    };
  });

  return coursesWithDiscount;
};

type CourseWithExtras = Course & {
  discountedPrice: number;
  averageRating: number;
  totalReviews: number;
};

const getCourseById = async (id: string): Promise<CourseWithExtras | null> => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        include: {
          videos: {
            include: {
              videoResources: true,
            },
          },
        },
      },
      enrollments: true,
      learningData: true,
       reviews: {
        include: {
          course: {
            select: {         
              title: true,              
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true
            }
          }
        }
      },
    },
  });

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
  }

  // Calculate average rating
  const averageRating = course.reviews.length > 0 
    ? Math.round((course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length) * 10) / 10
    : 0;

  // Return course with additional calculated fields
  return {
    ...course,
      discountedPrice: course.price - (course.price * course.discount / 100),
    averageRating,
    totalReviews: course.reviews.length
  };
};
const updateCourse = async (
  id: string,
  payload: Partial<Course>
): Promise<Course> => {
  const result = await prisma.course.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteCourse = async (id: string): Promise<Course> => {
  const result = await prisma.course.delete({
    where: {
      id,
    },
  });

  return result;
};

const getCoursesByStatus = async (status: CourseStatus): Promise<Course[]> => {
  const result = await prisma.course.findMany({
    where: {
      status,
    },
    include: {
      modules: true,
      enrollments: true,
      reviews: true,
    },
  });
  return result;
};

const getCoursesByType = async (type: CourseType): Promise<Course[]> => {
  const result = await prisma.course.findMany({
    where: {
      courseType: type,
    },
    include: {
      modules: true,
      enrollments: true,
      reviews: true,
    },
  });
  return result;
};

const getCoursesByLevel = async (level: SkillLevel): Promise<Course[]> => {
  const result = await prisma.course.findMany({
    where: {
      level,
    },
    include: {
      modules: true,
      enrollments: true,
      reviews: true,
    },
  });
  return result;
};

export const CourseService = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByStatus,
  getCoursesByType,
  getCoursesByLevel,
};
