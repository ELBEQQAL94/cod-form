import express from "express";

// Controllers
import { getShopifyFieldsController } from "../controllers/fieldController.js";

const fieldRouter = express.Router();

fieldRouter.get("/:userId", getShopifyFieldsController);

export default fieldRouter;
