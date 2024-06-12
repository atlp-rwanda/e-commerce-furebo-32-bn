import express  from "express";
import { createProduct, getAvailableItems } from "../controllers/product.controller";
import { upload } from "../utils/multer.utils";
import { protectRoute } from "../middlewares/auth.middleware";

const router=express.Router();

router.post('/createProduct/:collection_id',protectRoute,upload,createProduct);
router.get('/availableItems',protectRoute, getAvailableItems);

export default router;
