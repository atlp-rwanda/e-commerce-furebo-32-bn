

import express from "express";
import {
  updateRole,
  userSignup,
  userLogin,
  changeAccountStatus,
  updatePassword
} from "../controllers/user.controller";
import { protectRoute, restrictTo } from "../middlewares/auth.middleware";
import { validateUser, validateUserLogin,validateUserUpdatePassword } from "../validations/user.validate";
import { userRole } from "../utils/variable.utils";
import { getProfileController, updateProfileController } from "../controllers/profile.controller";
import upload from "../utils/multer";
import isImageUploaded from "../helper/isImageUploaded";

const userRoutes = express.Router();

userRoutes.post("/signup", validateUser, userSignup);
userRoutes.patch("/:id", protectRoute, restrictTo(userRole.admin), updateRole);
userRoutes.patch(
  "/change-account-status/:id",
  protectRoute,
  restrictTo(userRole.admin),
  changeAccountStatus
);

userRoutes.post('/login', validateUserLogin, userLogin);
userRoutes.patch('/:id/updatepassword',protectRoute,validateUserUpdatePassword, updatePassword);
userRoutes.get(
  '/profile',
  protectRoute,
  getProfileController
);
userRoutes.patch(
  '/profile',
  upload.single('profileImage'),
  // protectRoute,
  isImageUploaded,
  updateProfileController
);
export default userRoutes;
