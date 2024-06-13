import express from "express";

import {
  createProduct,
  searchProducts,
  getAvailableProducts,
} from "../controllers/product.controller";
import { upload } from "../utils/multer.utils";
import { protectRoute } from "../middlewares/auth.middleware";
const router = express.Router();

router.post(
  "/createProduct/:collection_id",
  protectRoute,
  upload,
  createProduct
);
router.post("/searchProduct", protectRoute, searchProducts);
router.get("/availableProducts/:seller_id", protectRoute, getAvailableProducts);
export default router;
