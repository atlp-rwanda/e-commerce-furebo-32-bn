import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  updateProductDetails,
} from "../controllers/product.controller";
import { protectRoute, restrictTo } from "../middlewares/auth.middleware";
import {
  validateProductCreation,
  validateProductUpdate,
} from "../validations/product.validate";
import { userRole } from "../utils/variable.utils";

const productRoutes = Router();

// Route to create a product, only accessible by sellers
productRoutes.post(
  "/create",
  protectRoute,
  restrictTo(userRole.seller),
  validateProductCreation,
  createProduct
);
//Route to get all product, only accessible by sellers
productRoutes.get(
  "/all",
  protectRoute,
  restrictTo(userRole.seller),
  getAllProducts
);
// Route to update product details, only accessible by sellers
productRoutes.patch(
  "/update/:id",
  protectRoute,
  restrictTo(userRole.seller),
  validateProductUpdate,
  updateProductDetails
);

export default productRoutes;

