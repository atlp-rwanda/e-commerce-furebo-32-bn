import express  from "express";
import { createProduct, getAvailableItems, searchProducts,getAvailableProducts, updateProductAvailability,viewProduct,viewProductBySeller } from "../controllers/product.controller";
import {
  updateImageByUrl,
  updateProduct,
  addImages,
  UpdateAllImages,
  removeImage,
  reviewProduct,
  getReviews,
  deleteReview
} from "../controllers/product.controller";
import { upload } from "../utils/multer.utils";
import { protectRoute, restrictTo } from "../middlewares/auth.middleware";
import { deleteProduct } from "../controllers/product.controller";
import { userRole } from "../utils/variable.utils";
import { checkProductOwner } from "../middlewares/product.middleware";
const router = express.Router();

router.post('/createProduct/:collection_id',protectRoute,restrictTo(userRole.seller),upload,createProduct);
router.get('/availableItems',protectRoute, getAvailableItems);
router.post("/searchProduct", protectRoute, searchProducts);
router.get("/availableProducts/:seller_id", protectRoute, getAvailableProducts);
router.patch(
  "/updateAvailability/:id",
  protectRoute,restrictTo(userRole.seller),
  updateProductAvailability
);

router.delete('/deleteProduct/:product_id',protectRoute,restrictTo(userRole.seller),checkProductOwner,deleteProduct) 

router.patch('/updateProduct/:product_id',protectRoute,restrictTo(userRole.seller),upload,checkProductOwner,updateProduct);
router.patch('/updateAllProductImages/:product_id',protectRoute,restrictTo(userRole.seller),checkProductOwner,upload,UpdateAllImages);
router.patch('/updateProductImage/:product_id',protectRoute,restrictTo(userRole.seller),upload,checkProductOwner,updateImageByUrl);
router.patch('/removeProductImage/:product_id',protectRoute,restrictTo(userRole.seller),upload,checkProductOwner,removeImage);
router.patch('/addProductImage/:product_id',protectRoute,restrictTo(userRole.seller),upload,checkProductOwner,addImages)
router.get('/viewProduct/:product_id',protectRoute,viewProduct)
router.get('/sellerViewProduct/:product_id/:collection_id',protectRoute,restrictTo(userRole.seller),viewProductBySeller)
router.post('/reviewProduct/:product_id',protectRoute,restrictTo(userRole.buyer),reviewProduct)
router.get('/getReviews/:product_id',protectRoute,getReviews)
router.delete('/deleteReview/:product_id/:review_id', protectRoute, deleteReview)

export default router;
