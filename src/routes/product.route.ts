import express  from "express";

import { createProduct } from "../controllers/product.controller";
import { createCollection } from "../controllers/product.controller";
import { upload } from "../middlewares/multer.middleware";
const router=express.Router();

router.post('/createProduct/:collection_id',upload,createProduct);
router.post('/createCollection/:seller_id',createCollection)

export default router;
