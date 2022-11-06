import express from "express";

// Controllers
import { getShopController } from "../controllers/storeController.js";

const storeRouter = express.Router();

storeRouter.get("/:shopName", getShopController);

export default storeRouter;
