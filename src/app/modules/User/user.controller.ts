import httpStatus from "http-status"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { userService } from "./user.services"
import { Request, Response } from "express"
import pick from "../../../shared/pick"
import { userFilterableFields } from "./user.costant"

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createUserIntoDb(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message:
      "User created successfully! An OTP has been sent to your email address. Please verify your email to activate your account.",
    data: result,
  })
})

// get all user form db
const getUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getUsersFromDb(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Users retrieve successfully!",
    data: result,
  })
})

//get user by id
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await userService.getUserById(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User retrieved successfully!",
    data: result,
  })
})

// get all user form db
const updateProfile = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req?.user

    const result = await userService.updateProfile(user, req.body)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Profile updated successfully!",
      data: result,
    })
  }
)

// *! update user role and account status
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await userService.updateUserIntoDb(req.body, id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User updated successfully!",
    data: result,
  })
})

// *! resend otp
const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await userService.resendOtp(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Verification OTP has been resent to your email. Please check your inbox and verify your email within 10 minutes.",
    data: result,
  });
});

export const userController = {
  createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateUser,
  resendOtp,
}
