import { Shopify } from "@shopify/shopify-api";
import { Session } from "@shopify/shopify-api/dist/auth/session/session.js";
import Cryptr from "cryptr";

// Queries
import {
  findSessionQuery,
  createSessionQuery,
  updateSessionQuery,
  deleteSessionQuery,
} from "../queries/sessionQueries.js";

const cryption = new Cryptr(process.env.ENCRYPTION_STRING);

const storeCallback = async (session) => {
  const result = await findSessionQuery(session.id);
  //   const result = await SessionModel.findOne({ id: session.id });

  if (result === null) {
    const sessionData = {
      id: session.id,
      content: cryption.encrypt(JSON.stringify(session)),
      shop: session.shop,
    };
    await createSessionQuery(sessionData);
    // await SessionModel.create({
    //   id: session.id,
    //   content: cryption.encrypt(JSON.stringify(session)),
    //   shop: session.shop,
    // });
  } else {
    const updatedSessionData = {
      content: cryption.encrypt(JSON.stringify(session)),
      shop: session.shop,
    };
    await updateSessionQuery(session.id, updatedSessionData);
    // await SessionModel.findOneAndUpdate(
    //   { id: session.id },
    //   {
    //     content: cryption.encrypt(JSON.stringify(session)),
    //     shop: session.shop,
    //   }
    // );
  }

  return true;
};

const loadCallback = async (id) => {
  const sessionResult = await findSessionQuery(id);
  //   const sessionResult = await SessionModel.findOne({ id });
  if (sessionResult.content.length > 0) {
    const sessionObj = JSON.parse(cryption.decrypt(sessionResult.content));
    return Session.cloneSession(sessionObj, sessionObj.id);
  }
  return undefined;
};

const deleteCallback = async (id) => {
  await deleteSessionQuery(id);
  //   await SessionModel.deleteMany({ id });
  return true;
};

export const sessionStorage = new Shopify.Session.CustomSessionStorage(
  storeCallback,
  loadCallback,
  deleteCallback
);
