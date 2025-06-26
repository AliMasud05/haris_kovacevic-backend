import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Contact } from "@prisma/client";

const createContact = async (payload: Contact): Promise<Contact> => {
  const result = await prisma.contact.create({
    data: payload,
  });
  return result;
};

const getAllContacts = async (): Promise<Contact[]> => {
  const result = await prisma.contact.findMany();
  return result;
};

const getContactById = async (id: string): Promise<Contact | null> => {
  const result = await prisma.contact.findUnique({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Contact not found");
  }

  return result;
};

const updateContact = async (
  id: string,
  payload: Partial<Contact>
): Promise<Contact> => {
  const result = await prisma.contact.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteContact = async (id: string): Promise<Contact> => {
  const result = await prisma.contact.delete({
    where: { id },
  });
  return result;
};

export const ContactService = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};