import express  from "express";
import { createCollection } from "../controllers/collection.controller";
import { protectRoute, restrictTo } from "../middlewares/auth.middleware";
import {
  getSellerItems,
  updateCollection,
  deleteCollection,
} from "../controllers/collection.controller";
import { userRole } from "../utils/variable.utils";

const router=express.Router();

router.post('/createCollection',protectRoute,restrictTo(userRole.seller),createCollection)
router.get('/collection',protectRoute,getSellerItems)
router.put(
  "/updateCollection/:id",
  protectRoute,
  restrictTo(userRole.seller),
  updateCollection
);
router.delete(
  "/deleteCollection/:id",
  protectRoute,
  restrictTo(userRole.seller),
  deleteCollection
);

export default router;
