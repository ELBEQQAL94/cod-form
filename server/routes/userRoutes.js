import express from "express";

// Controllers
import { getShopController } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/:shopName", getShopController);

export default userRouter;
