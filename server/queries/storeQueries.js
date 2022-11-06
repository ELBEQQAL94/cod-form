// Libraries
import { PrismaClient } from "@prisma/client";

// Queries
import { createFieldsQuery, createCurrentFieldsQuery } from "./fieldQueries.js";

const prisma = new PrismaClient();

export const createStoreQuery = async (storeData) => {
  const store = await prisma.store.create({
    data: storeData,
  });
  const storeId = store.id;
  await createFieldsQuery(storeId);
  await createCurrentFieldsQuery(storeId);
};

export const findStoreQuery = async (shop) => {
  const store = prisma.store.findFirst({
    where: {
      shop,
    },
  });
  return store;
};

export const updateStoreQuery = async (shop, storeData) => {
  await prisma.store.update({
    where: {
      shop,
    },
    data: storeData,
  });
};
