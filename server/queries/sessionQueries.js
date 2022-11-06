// Libraries
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createSessionQuery = async (sessionData) => {
  return await prisma.session.create({
    data: sessionData,
  });
};

export const findSessionQuery = async (sessionId) => {
  const session = prisma.session.findFirst({
    where: {
      id: sessionId,
    },
  });
  return session;
};

export const updateSessionQuery = async (sessionId, sessionData) => {
  await prisma.session.update({
    where: {
      id: sessionId,
    },
    data: sessionData,
  });
};

export const deleteSessionQuery = async (sessionId) => {
  await prisma.session.delete({
    where: {
      id: sessionId,
    },
  });
};
