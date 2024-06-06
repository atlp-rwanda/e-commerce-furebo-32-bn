import express  from "express";

import { createCollection } from "../controllers/collection.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router=express.Router();

router.post('/createCollection/:seller_id',protectRoute,createCollection)

export default router;
