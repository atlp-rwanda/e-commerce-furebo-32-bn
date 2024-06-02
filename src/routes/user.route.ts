import express from "express";
import {
  updateRole,
  userSignup,
  userLogin,
  changeAccountStatus,
  updatePassword,
  requestResetPassword,
  resetPassword,
} from "../controllers/user.controller";
import { isUserFound } from "../middlewares/isUserFound";
import { protectRoute, restrictTo } from "../middlewares/auth.middleware";
import { validateUser, validateUserLogin,validateUserUpdatePassword } from "../validations/user.validate";
import { userRole } from "../utils/variable.utils";

const userRoutes = express.Router();

userRoutes.post("/signup", validateUser, userSignup);
userRoutes.post("/request-reset-password", isUserFound, requestResetPassword);
userRoutes.patch("/reset-password", resetPassword);

userRoutes.patch("/:id", protectRoute, restrictTo(userRole.admin), updateRole);
userRoutes.patch(
  "/change-account-status/:id",
  protectRoute,
  restrictTo(userRole.admin),
  changeAccountStatus
);

userRoutes.post('/login', validateUserLogin, userLogin);
userRoutes.patch('/:id/updatepassword',protectRoute,validateUserUpdatePassword, updatePassword);
export default userRoutes;
