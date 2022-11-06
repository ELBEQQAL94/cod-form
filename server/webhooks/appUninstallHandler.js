// Queries
import { deleteSessionQuery } from "../queries/sessionQueries.js";
import { findStoreQuery } from "../queries/storeQueries.js";

export default async function appUninstallHandler(
  topic,
  shop,
  webhookRequestBody
) {
  await findStoreQuery(shop, { isActive: false });
  await deleteSessionQuery(shop);
}
