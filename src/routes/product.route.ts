import express  from "express";
import { createProduct, getAvailableItems, searchProducts,getAvailableProducts, updateProductAvailability } from "../controllers/product.controller";
import { upload } from "../utils/multer.utils";
import { protectRoute, restrictTo } from "../middlewares/auth.middleware";
import { userRole } from "../utils/variable.utils";
const router = express.Router();

router.post('/createProduct/:collection_id',protectRoute,upload,createProduct);
router.get('/availableItems',protectRoute, getAvailableItems);
router.post("/searchProduct", protectRoute, searchProducts);
router.get("/availableProducts/:seller_id", protectRoute, getAvailableProducts);
router.patch(
  "/updateAvailability/:id",
  protectRoute,restrictTo(userRole.seller),
  updateProductAvailability
);
export default router;
