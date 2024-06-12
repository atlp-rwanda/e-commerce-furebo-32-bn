import express  from "express";
import { createCollection } from "../controllers/collection.controller";
import { protectRoute } from "../middlewares/auth.middleware";
import { getSellerItems } from "../controllers/collection.controller";

const router=express.Router();

router.post('/createCollection/:seller_id',protectRoute,createCollection)
router.get('/getSellerItems/:seller_id',protectRoute,getSellerItems)

export default router;
