import express from "express";

// Controllers
import { getShopifyFieldsController } from "../controllers/fieldController.js";

const fieldRouter = express.Router();

fieldRouter.get("/:storeId", getShopifyFieldsController);

export default fieldRouter;
