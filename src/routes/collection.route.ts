import express  from "express";

import { createCollection } from "../controllers/collection.controller";

const router=express.Router();

router.post('/createCollection/:seller_id',createCollection)

export default router;
