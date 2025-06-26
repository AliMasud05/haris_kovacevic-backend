import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ContactService } from "./contact.service";

const createContact = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.createContact(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Contact created successfully",
    data: result,
  });
});

const getAllContacts = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.getAllContacts();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Contacts retrieved successfully",
    data: result,
  });
});

const getContactById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ContactService.getContactById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Contact retrieved successfully",
    data: result,
  });
});

const updateContact = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ContactService.updateContact(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Contact updated successfully",
    data: result,
  });
});

const deleteContact = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ContactService.deleteContact(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Contact deleted successfully",
    data: result,
  });
});

export const ContactController = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};