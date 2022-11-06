import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createFieldsQuery = async (storeId) => {
  await prisma.field.createMany({
    data: [
      {
        label: "First Name",
        placeholder: "First Name",
        requiredMessage: "First name is required",
        ErrorMessage: "First name should not contain any numeric characters",
        storeId,
      },
      {
        label: "Last Name",
        placeholder: "Last Name",
        requiredMessage: "Last name is required",
        ErrorMessage: "Last name should not contain any numeric characters",
        required: true,
        storeId,
      },
      {
        label: "Address line 1",
        placeholder: "Address line 1",
        requiredMessage: "Address is required",
        ErrorMessage: "Address is required",
        storeId,
      },
      {
        label: "City",
        placeholder: "City",
        requiredMessage: "City is required",
        ErrorMessage: "City is required",
        storeId,
      },
      {
        label: "Confirm phone",
        placeholder: "Confirm phone",
        requiredMessage: "Confirm phone is required",
        ErrorMessage: "Please retype the same phone number",
        storeId,
      },
      {
        label: "Email",
        placeholder: "Email",
        requiredMessage: "Email is required",
        ErrorMessage: "Please enter a valid email address",
        storeId,
      },
      {
        label: "Country",
        placeholder: "Country",
        requiredMessage: "Country is required",
        storeId,
      },
      {
        label: "ZIP code",
        placeholder: "ZIP code",
        requiredMessage: "ZIP code is required",
        storeId,
      },
      {
        label: "Address line 2",
        placeholder: "Address line 2",
        requiredMessage: "Address ligne 2 is required",
        storeId,
      },
      {
        label: "Province",
        placeholder: "Province",
        requiredMessage: "Province is required",
        storeId,
      },
      {
        label: "Note",
        placeholder: "Note",
        requiredMessage: "Note is required",
        storeId,
      },
      {
        label: "Phone",
        placeholder: "Phone",
        requiredMessage: "Phone is required",
        ErrorMessage: "Please enter a valid phone number",
        storeId,
      },
      {
        type: "button",
        label: "Confirm Order",
        storeId,
      },
    ],
  });
};

export const createCurrentFieldsQuery = async (storeId) => {
  let currentFields = await prisma.field.findMany({
    where: {
      storeId,
      label: {
        in: ["First Name", "Last Name", "Phone", "Email", "Address line 1"],
      },
    },
    select: {
      id: true,
      storeId: true,
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

export const getCurrentFieldsQuery = async (storeId) => {
  const currentFields = await prisma.user.findMany({
    where: {
      id: storeId,
    },
    include: {
      currentFieldsOnUsers: { include: { field: true } },
    },
  });
  return currentFields;
};

export const getShopifyFieldsQuery = async (storeId) => {
  const fields = await prisma.field.findMany({
    where: {
      storeId,
    },
  });
  const currentFields = await prisma.currentFieldsOnUsers.findMany({
    where: {
      storeId,
    },
  });
  const restFields = fields.filter(
    (field) =>
      !currentFields.find((currentField) => currentField.fieldId === field.id)
  );
  return restFields;
};
