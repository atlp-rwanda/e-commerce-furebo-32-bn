import express  from "express";
import { createCollection } from "../controllers/collection.controller";
import { protectRoute, restrictTo } from "../middlewares/auth.middleware";
import { getSellerItems } from "../controllers/collection.controller";
import { userRole } from "../utils/variable.utils";

const router=express.Router();

router.post('/createCollection/:seller_id',protectRoute,restrictTo(userRole.seller),createCollection)
router.get('/seller/collection/:seller_id',protectRoute, restrictTo(userRole.seller), getSellerItems)

export default router;
