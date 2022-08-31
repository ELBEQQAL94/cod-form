// Queries
import { findUserQuery } from "../queries/userQueries.js";

// GET SHOP BY SHOP NAME
export const getShopController = async (req, res) => {
  const { shopName } = req.params;
  const user = await findUserQuery(shopName);

  return res.status(200).json({
    status: 200,
    content: user,
  });
};
