// Libraries
import { PrismaClient } from "@prisma/client";

// Queries
import { createFieldsQuery, createCurrentFieldsQuery } from "./fieldQueries.js";

const prisma = new PrismaClient();

export const createUserQuery = async (shop, accessToken) => {
  const user = await prisma.user.create({
    data: {
      shop,
      accessToken,
    },
  });
  const userId = user.id;
  await createFieldsQuery(userId);
  await createCurrentFieldsQuery(userId);
};

export const findUserQuery = async (shop) => {
  const user = prisma.user.findFirst({
    where: {
      shop,
    },
  });
  return user;
};
