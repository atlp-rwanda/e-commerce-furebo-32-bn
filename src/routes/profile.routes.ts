// routes/profile.routes.ts

import express from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller";
import { protectRoute } from "../middlewares/auth.middleware";
import { upload } from "../utils/multer.utils";

const profileRoutes = express.Router();

profileRoutes.get("/profile", protectRoute, getProfile);
profileRoutes.patch("/update-profile", protectRoute,upload, updateProfile);

export default profileRoutes;
