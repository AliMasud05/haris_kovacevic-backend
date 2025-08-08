import { Secret } from "jsonwebtoken"
import config from "../../../config"
import { jwtHelpers } from "../../../helpers/jwtHelpers"
import prisma from "../../../shared/prisma"
import * as bcrypt from "bcrypt"
import ApiError from "../../../errors/ApiErrors"
import { UserStatus } from "@prisma/client"
import httpStatus from "http-status"
import { sendEmail } from "../../utils/sendEmail"
import { userService } from "../User/user.services"

// user login
const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData?.email) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found! with this email " + payload.email
    );
  }
  if (!userData.password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password not set for this user."
    );
  }
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password incorrect!");
  }

  if(!userData.isEmailVerified){
    await userService.resendOtp(userData.email)
    return {message: "Please verify your email address. A new OTP has been sent to your email."}
  }
  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return { token: accessToken };
};
// get user profile
const getMyProfile = async (userId: string) => {
  const userProfile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      phoneNumber: true,
      enrollments: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              subtitle: true,
              status: true,
              releaseDate: true,
            },
          },
          progress: true,
        },
      },
      houseNumber: true,
      fullAddress: true,
      street: true,
      city: true,
      state: true,
      postalCode: true,
      role: true,
      status: true,
      payments: true,
      reviews: true,
      progress: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return userProfile
}

const getMyProfileWithProgress = async (userId: string) => {
  // First get the basic user profile with enrollments
  const userProfile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      phoneNumber: true,
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
              releaseDate: true, // ✅ Was incorrectly 'releaseData'
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
      houseNumber: true,
      fullAddress: true,
      street: true,
      city: true,
      state: true,
      postalCode: true,
      role: true,
      status: true,
      payments: true,
      reviews: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!userProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Get all enrollment IDs for this user
  const enrollmentIds = userProfile.enrollments.map((e) => e.id);

  // Get all progress records for these enrollments
  const allProgressRecords = await prisma.progress.findMany({
    where: {
      userId,
      enrollmentId: { in: enrollmentIds },
    },
  });

  // Enhance each enrollment with progress summary
  const enrichedEnrollments = userProfile.enrollments.map((enrollment) => {
    const progressRecords = allProgressRecords.filter(
      (p) => p.enrollmentId === enrollment.id
    );

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

    // Create a simplified course object without modules details
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
      paymentStatus: enrollment.paymentStatus,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt,
      status: enrollment.status,
      course: simplifiedCourse,
      discount: enrollment.discount,
      progressSummary: {
        totalVideos,
        completedVideos,
        inProgressVideos,
        overallProgress,
        lastWatched,
      },
    };
  });

  return {
    ...userProfile,
    enrollments: enrichedEnrollments,
  };
};

// change password

const changePassword = async (
  userToken: string,
  newPassword: string,
  oldPassword: string
) => {
  const decodedToken = jwtHelpers.verifyToken(userToken, config.jwt.jwt_secret!)

  const user = await prisma.user.findUnique({
    where: { id: decodedToken?.id },
  })

  if (!user) {
    throw new ApiError(404, "User not found")
  }
  if (!user.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password not set for this user.");
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user?.password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect old password")
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12)

  const result = await prisma.user.update({
    where: {
      id: decodedToken.id,
    },
    data: {
      password: hashedPassword,
    },
  })
  return { message: "Password changed successfully" }
}

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  })

  const resetPassToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role, id: userData.id },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_token_expires_in as string
  )

  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`

  await sendEmail(
    userData.email,
    "Reset Your Password",
    `
     <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Dear ${userData.name},</p>
          
          <p>We received a request to reset your password. Click the button below to reset your password:</p>
          
          <a href="${resetPassLink}" style="text-decoration: none;">
            <button style="background-color: #007BFF; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
              Reset Password
            </button>
          </a>
          
          <p>If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>
          
          <p>Thank you</p>
</div>

      `
  )
  return { message: "Reset password link sent via your email successfully" }
}

// reset password
const resetPassword = async (token: string, payload: { password: string }) => {
  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_secret as Secret
  )

  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!")
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: isValidToken.id,
    },
  })

  // hash password
  const password = await bcrypt.hash(payload.password, 12)

  // update into database
  await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password,
    },
  })
  return { message: "Password reset successfully" }
}

const verifyOtp = async (payload: { email: string; otp: number }) => {
  // Fetch user data by email
  const userData = await prisma.user.findUniqueOrThrow({
    where: { email: payload.email },
  });

  // Check if OTP exists and is not expired
  if (!userData.otp || !userData.expiresAt) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "OTP not found or has expired. Please request a new OTP."
    );
  }

  // Verify the OTP and its expiration
  const currentTime = new Date();
  if (userData.otp !== payload.otp || currentTime > userData.expiresAt) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid or expired OTP. Please try again."
    );
  }

  // OTP is valid; allow the user to proceed
  // Optionally clear OTP and expiration after verification
  await prisma.user.update({
    where: { email: payload.email },
    data: { otp: null, expiresAt: null, isEmailVerified: true },
  });
  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );
  return {
    message: "OTP verified successfully.",
    token: accessToken,
  };
};

const loginWithGoogle = async (payload: {
  name: string;
  email: string;
  profileImage: string;
}) => {
  console.log(payload);
  const userData = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });
  if (!userData) {
    const newUser = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        profileImage: payload?.profileImage,
        isEmailVerified: true, 
      },
    });
    const accessToken = jwtHelpers.generateToken(
      {
        id: newUser.id,
        role: newUser.role,
        name: payload.name,
        email: payload.email,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );
    return { token: accessToken };
  }
  if (userData.status === UserStatus.INACTIVE) {
    throw new ApiError(403, "Your account is Suspended");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );
  console.log(accessToken);
  return { token: accessToken };
};


export const AuthServices = {
  loginUser,
  getMyProfile,
  getMyProfileWithProgress,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyOtp,
  loginWithGoogle,
};
