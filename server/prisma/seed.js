import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.field.createMany({
    data: [
      {
        label: "First Name",
        placeholder: "First Name",
        requiredMessage: "First name is required",
        ErrorMessage: "First name should not contain any numeric characters",
      },
      {
        label: "Last Name",
        placeholder: "Last Name",
        requiredMessage: "Last name is required",
        ErrorMessage: "Last name should not contain any numeric characters",
        required: true,
      },
      {
        label: "Address line 1",
        placeholder: "Address line 1",
        requiredMessage: "Address is required",
        ErrorMessage: "Address is required",
      },
      {
        label: "City",
        placeholder: "City",
        requiredMessage: "City is required",
        ErrorMessage: "City is required",
      },
      {
        label: "Confirm phone",
        placeholder: "Confirm phone",
        requiredMessage: "Confirm phone is required",
        ErrorMessage: "Please retype the same phone number",
      },
      {
        label: "Email",
        placeholder: "Email",
        requiredMessage: "Email is required",
        ErrorMessage: "Please enter a valid email address",
      },
      {
        label: "Country",
        placeholder: "Country",
        requiredMessage: "Country is required",
      },
      {
        label: "ZIP code",
        placeholder: "ZIP code",
        requiredMessage: "ZIP code is required",
      },
      {
        label: "Address line 2",
        placeholder: "Address line 2",
        requiredMessage: "Address ligne 2 is required",
      },
      {
        label: "Province",
        placeholder: "Province",
        requiredMessage: "Province is required",
      },
      {
        label: "Note",
        placeholder: "Note",
        requiredMessage: "Note is required",
      },
      {
        label: "Phone",
        placeholder: "Phone",
        requiredMessage: "Phone is required",
        ErrorMessage: "Please enter a valid phone number",
      },
      {
        type: "button",
        label: "Confirm order",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
