// Libraries
import { PrismaClient } from "@prisma/client";

// Queries
import { createFields, createCurrentFields } from "./fieldQueries.js";

const prisma = new PrismaClient();

export const createUser = async (shop, accessToken) => {
  const user = await prisma.user.create({
    data: {
      shop,
      accessToken,
    },
  });
  const userId = user.id;
  await createFields(userId);
  await createCurrentFields(userId);
  // SEED FIELDS RELATED TO
  // CURRENT USER
};

export const findUser = async (shop) => {
  const user = prisma.user.findFirst({
    where: {
      shop,
    },
  });
  return user;
};
