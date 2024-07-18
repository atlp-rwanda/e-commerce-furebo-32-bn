import express  from "express";
import { createCollection } from "../controllers/collection.controller";
import { protectRoute, restrictTo } from "../middlewares/auth.middleware";
import { getSellerItems } from "../controllers/collection.controller";
import { userRole } from "../utils/variable.utils";

const router=express.Router();

router.post('/createCollection',protectRoute,restrictTo(userRole.seller),createCollection)
router.get('/collection',protectRoute,getSellerItems)

export default router;
