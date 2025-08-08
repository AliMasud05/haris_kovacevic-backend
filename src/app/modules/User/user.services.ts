import prisma from "../../../shared/prisma"
import ApiError from "../../../errors/ApiErrors"
import { IUser, IUserFilterRequest } from "./user.interface"
import * as bcrypt from "bcrypt"
import { IPaginationOptions } from "../../../interfaces/paginations"
import { paginationHelper } from "../../../helpers/paginationHelper"
import { Prisma, User, UserRole, UserStatus } from "@prisma/client"
import { userSearchAbleFields } from "./user.costant"
import config from "../../../config"
import httpStatus from "http-status"
import emailSender from "../Auth/emailSender"
import { html } from "../../utils/emailverification"
import { sendEmail } from "../../utils/sendEmail"

// Create a new user in the database.
const createUserIntoDb = async (payload: User) => {
  const result = await prisma.$transaction(async(transactionClient)=>{
    const existingUser = await transactionClient.user.findFirst({
      where: {
        email: payload.email,
      },
    })
    if (existingUser) {
      if (existingUser.email === payload.email) {
        throw new ApiError(
          400,
          `User with this email ${payload.email} already exists`
        )
      }
    }
    //verify user send password is not empty
    if(!payload.password){
      throw new ApiError(httpStatus.BAD_REQUEST, "Password is required")
    }
    const hashedPassword: string = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds)||12
    )
    //generate otp for email verification
    const otp = Math.floor(100000 + Math.random() * 900000);


    //create user within a transaction to ensure atomicity

    const user = await transactionClient.user.create({
        data: {
        ...payload,
        password: hashedPassword,
        otp: otp,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    if (!user) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create user"
      )
    }
    //send otp to user email
    await sendEmail("Verify Your Email", user.email, html(otp));

    return user
  })
  return result
}
  


// reterive all users from the database also searcing anf filetering
const getUsersFromDb = async (query: any) => {
  const { page = 1, limit = 10 } = query

  const skip = (Number(page) - 1) * Number(limit)
  const take = Number(limit)

  const whereConditions: any = {}

  const totalUsers = await prisma.user.count({
    where: whereConditions,
  })

  const users = await prisma.user.findMany({
    where: whereConditions,
    skip: skip,
    take: take,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      enrollments:{
        include: {
          course: {
            select: {
              id: true,
              title: true,
              subtitle: true,
            },
          },
        },
      },
      reviews: true,      
   
    },
  })

  return {
    meta: {
      page,
      limit,
      total: totalUsers,
    },
    data: users,
  }
}

//GET ISER BY ID
const getUserById = async (id: string) => {
  // Step 1: Get the basic user profile with enrollments and necessary relations
  const userProfile = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      phoneNumber: true,
      role: true,
      status: true,
      payments: true,
      reviews: true,
      street: true,
      city: true,
      state: true,
      postalCode: true,
      fullAddress: true,
      isEmailVerified: true,
      houseNumber: true,
      resourceEnrollments: true,
      enrollments: {
        select: {
          id: true,
          userId: true,
          courseId: true,
          Amount: true,
          discount: true,
          paymentStatus: true,
          enrolledAt: true,
          completedAt: true,
          status: true,
          course: {
            select: {
              id: true,
              title: true,
              subtitle: true,
              status: true,
              releaseDate: true,
              modules: {
                select: {
                  id: true,
                  videos: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      progress: {
        select: {
          id: true,
          userId: true,
          enrollmentId: true,
          videoId: true,
          progress: true,
          isCompleted: true,
          lastWatched: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!userProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Step 2: Extract enrollment IDs to filter progress records
  const enrollmentIds = userProfile.enrollments.map((e) => e.id);

  // Step 3: Get all progress records for these enrollments
  const allProgressRecords = await prisma.progress.findMany({
    where: {
      userId: id,
      enrollmentId: { in: enrollmentIds },
    },
  });

  // Step 4: Enhance each enrollment with progress summary
  const enrichedEnrollments = userProfile.enrollments.map((enrollment) => {
    const enrollmentProgress = allProgressRecords.filter(
      (p) => p.enrollmentId === enrollment.id
    );

    const totalVideos = enrollment.course.modules.reduce(
      (sum, module) => sum + module.videos.length,
      0
    );

    const completedVideos = enrollmentProgress.filter(
      (p) => p.isCompleted
    ).length;
    const inProgressVideos = enrollmentProgress.filter(
      (p) => !p.isCompleted && p.progress > 0
    ).length;

    const overallProgress =
      totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

    const lastWatched =
      enrollmentProgress.length > 0
        ? enrollmentProgress.reduce(
            (latest, current) =>
              current.lastWatched > latest ? current.lastWatched : latest,
            enrollmentProgress[0].lastWatched
          )
        : undefined;

    // Simplified course object (without modules/videos)
    const simplifiedCourse = {
      id: enrollment.course.id,
      title: enrollment.course.title,
      subtitle: enrollment.course.subtitle,
      status: enrollment.course.status,
      releaseDate: enrollment.course.releaseDate,
    };

    return {
      id: enrollment.id,
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      Amount: enrollment.Amount,
      discount: enrollment.discount,
      paymentStatus: enrollment.paymentStatus,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt,
      status: enrollment.status,
      course: simplifiedCourse,
      progressSummary: {
        totalVideos,
        completedVideos,
        inProgressVideos,
        overallProgress,
        lastWatched,
      },
    };
  });

  // Step 5: Return the user with enriched enrollments
  return {
    ...userProfile,
    enrollments: enrichedEnrollments,
    // Optionally omit raw progress array if no longer needed
    progress: undefined, // or remove this line if you want to keep progress
  };
};

// update profile by user won profile uisng token or email and id
const updateProfile = async (user: IUser, payload: User) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      email: user.email,
      id: user.id,
    },
  })

  if (!userInfo) {
    throw new ApiError(404, "User not found")
  }

  // Update the user profile with the new information
  const result = await prisma.user.update({
    where: {
      email: userInfo.email,
    },
    data: {
      name: payload.name || userInfo.name,
      email: payload.email || userInfo.email,
      profileImage: payload.profileImage || userInfo.profileImage,
      phoneNumber: payload.phoneNumber || userInfo.phoneNumber,
    },
    select: {
      id: true,
      name: true,

      email: true,
      profileImage: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!result)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update user profile"
    )

  return result
}

// update user data into database by id fir admin
const updateUserIntoDb = async (payload: IUser, id: string) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  })
  if (!userInfo)
    throw new ApiError(httpStatus.NOT_FOUND, "User not found with id: " + id)

  const result = await prisma.user.update({
    where: {
      id: userInfo.id,
    },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!result)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update user profile"
    )

  return result
}

const resendOtp = async (email: string) => {
  // Step 1: Find the user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  // Step 2: Regenerate OTP
  const newOtp = Math.floor(100000 + Math.random() * 900000); // Generate new 6-digit OTP

  // Step 3: Update OTP and expiry time in the database
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      otp: newOtp,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  if (!updatedUser) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update OTP."
    );
  }

  await emailSender(
    "Verify Your Email Address",
    updatedUser.email,
    html(newOtp)
  );

  // Step 5: Return success message or updated user details
  return { message: "OTP has been resent to your email." };
};


export const userService = {
  createUserIntoDb,
  getUsersFromDb,
  getUserById,
  updateProfile,
  updateUserIntoDb,
  resendOtp,
}
