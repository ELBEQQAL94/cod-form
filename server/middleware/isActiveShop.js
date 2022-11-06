// Queries
import {
  createStoreQuery,
  findStoreQuery,
  updateStoreQuery,
} from "../queries/storeQueries.js";
export default async function isActiveShop(req, res, next) {
  const { shop, host } = req.query;

  if (!shop) {
    next();
    return;
  }

  const isShopAvaialble = await findStoreQuery(shop);

  if (isShopAvaialble === null || !isShopAvaialble.isActive) {
    if (isShopAvaialble === null) {
      await createStoreQuery({ shop, isActive: false });
      //   await StoreModel.create({ shop, isActive: false });
    } else if (!isShopAvaialble.isActive) {
      await updateStoreQuery(shop, { isActive: false });
      //   await StoreModel.findOneAndUpdate({ shop }, { isActive: false });
    }
    res.redirect(`/auth?shop=${shop}&host=${host}`);
  } else {
    next();
  }
}
