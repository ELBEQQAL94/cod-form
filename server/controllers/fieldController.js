// Queries
import {
  getShopifyFieldsQuery,
  getCurrentFieldsQuery,
} from "../queries/fieldQueries.js";

// GET SHOPIFY FIELDS
export const getShopifyFieldsController = async (req, res) => {
  const { userId } = req.params;
  const shopifyFields = await getShopifyFieldsQuery(userId);
  const currentFields = await getCurrentFieldsQuery(userId);

  return res.status(200).json({
    status: 200,
    content: {
      shopifyFields,
      currentFields,
    },
  });
};

// GET CURRENT FIELDS
export const getCurrentFieldsController = (req, res) => {};
