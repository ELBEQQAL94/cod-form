import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createFields = async (userId) => {
  await prisma.field.createMany({
    data: [
      {
        label: "First Name",
        placeholder: "First Name",
        requiredMessage: "First name is required",
        ErrorMessage: "First name should not contain any numeric characters",
        userId,
      },
      {
        label: "Last Name",
        placeholder: "Last Name",
        requiredMessage: "Last name is required",
        ErrorMessage: "Last name should not contain any numeric characters",
        required: true,
        userId,
      },
      {
        label: "Address line 1",
        placeholder: "Address line 1",
        requiredMessage: "Address is required",
        ErrorMessage: "Address is required",
        userId,
      },
      {
        label: "City",
        placeholder: "City",
        requiredMessage: "City is required",
        ErrorMessage: "City is required",
        userId,
      },
      {
        label: "Confirm phone",
        placeholder: "Confirm phone",
        requiredMessage: "Confirm phone is required",
        ErrorMessage: "Please retype the same phone number",
        userId,
      },
      {
        label: "Email",
        placeholder: "Email",
        requiredMessage: "Email is required",
        ErrorMessage: "Please enter a valid email address",
        userId,
      },
      {
        label: "Country",
        placeholder: "Country",
        requiredMessage: "Country is required",
        userId,
      },
      {
        label: "ZIP code",
        placeholder: "ZIP code",
        requiredMessage: "ZIP code is required",
        userId,
      },
      {
        label: "Address line 2",
        placeholder: "Address line 2",
        requiredMessage: "Address ligne 2 is required",
        userId,
      },
      {
        label: "Province",
        placeholder: "Province",
        requiredMessage: "Province is required",
        userId,
      },
      {
        label: "Note",
        placeholder: "Note",
        requiredMessage: "Note is required",
        userId,
      },
      {
        label: "Phone",
        placeholder: "Phone",
        requiredMessage: "Phone is required",
        ErrorMessage: "Please enter a valid phone number",
        userId,
      },
    ],
  });
};

export const createCurrentFields = async (userId) => {
  let currentFields = await prisma.field.findMany({
    where: {
      userId,
      label: {
        in: ["First Name", "Last Name", "Phone", "Email", "Address line 1"],
      },
    },
    select: {
      id: true,
      userId: true,
    },
  });
  currentFields = currentFields.map((field) => {
    field.fieldId = field.id;
    delete field.id;
    return field;
  });
  await prisma.currentFieldsOnUsers.createMany({
    data: currentFields,
  });
};

export const getRestFields = async (userId) => {
  const fields = await prisma.field.findMany({
    where: {
      userId,
    },
  });
  const currentFields = await prisma.currentFieldsOnUsers.findMany({
    where: {
      userId,
    },
  });
  const restFields = fields.filter(
    (field) =>
      !currentFields.find((currentField) => currentField.fieldId === field.id)
  );
  return restFields;
};
