// Queries
import {
  getShopifyFieldsQuery,
  getCurrentFieldsQuery,
} from "../queries/fieldQueries.js";

// GET SHOPIFY FIELDS
export const getShopifyFieldsController = async (req, res) => {
  const { storeId } = req.params;
  const shopifyFields = await getShopifyFieldsQuery(storeId);
  const currentFields = await getCurrentFieldsQuery(storeId);

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
