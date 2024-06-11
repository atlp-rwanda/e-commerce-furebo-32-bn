import express from "express";

import {
  createProduct,
  searchProducts,
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

export default router;
