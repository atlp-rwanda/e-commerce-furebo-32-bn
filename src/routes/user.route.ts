import express from "express";
import {
  updateRole,
  userSignup,
  userLogin,
  changeAccountStatus,
} from "../controllers/user.controller";
import { protectRoute, restrictTo } from "../middlewares/auth.middleware";
import { validateUser, validateUserLogin } from "../validations/user.validate";

const userRoutes = express.Router();

userRoutes.post("/signup", validateUser, userSignup);
userRoutes.patch("/:id", protectRoute, restrictTo("admin"), updateRole);
userRoutes.patch(
  "/change-account-status/:id",
  protectRoute,
  restrictTo("admin"),
  changeAccountStatus
);

userRoutes.post("/login", validateUserLogin, userLogin);
export default userRoutes;
