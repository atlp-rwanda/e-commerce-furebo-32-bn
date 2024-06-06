import express  from "express";

import { createProduct } from "../controllers/product.controller";
import { upload } from "../utils/multer.utils";
const router=express.Router();

router.post('/createProduct/:collection_id',upload,createProduct);

export default router;
