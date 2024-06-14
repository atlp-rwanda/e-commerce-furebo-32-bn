import express from "express";

import {
  createProduct,
  searchProducts,
  getAvailableProducts,
  updateProductAvailability,
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
router.patch(
  "/updateAvailability/:id",
  protectRoute,
  updateProductAvailability
);
export default router;
