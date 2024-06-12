import express from "express";

import {
  createProduct,
  searchProducts,
  markProductAvailable
} from "../controllers/product.controller";
import { upload } from "../utils/multer.utils";
import { protectRoute, restrictTo } from "../middlewares/auth.middleware";
import { userRole } from "../utils/variable.utils";
const router = express.Router();

router.post(
  "/createProduct/:collection_id",
  protectRoute,
  upload,
  createProduct
);
router.post("/searchProduct", protectRoute, searchProducts);
router.patch(
  "/product/markAvailable/:productId",
  protectRoute, restrictTo(userRole.seller), markProductAvailable
);

export default router;
