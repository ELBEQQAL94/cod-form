// Queries
import { findStoreQuery } from "../queries/storeQueries.js";

// GET SHOP BY SHOP NAME
export const getShopController = async (req, res) => {
  const { shopName } = req.params;
  const store = await findStoreQuery(shopName);

  return res.status(200).json({
    status: 200,
    content: store,
  });
};
