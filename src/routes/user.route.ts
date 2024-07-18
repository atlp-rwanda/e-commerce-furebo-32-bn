import express from "express";
import { protectRoute, restrictTo } from "../middlewares/auth.middleware";
import { verifyEmail } from "../controllers/verifyUser.controller";
import { verifyTokenMiddleware } from "../middlewares/verifyToken.middleware";
import {
  updateRole,
  userSignup,
  userLogin,
  userLogout,
  changeAccountStatus,
  updatePassword,
  requestPasswordReset,
  resetPassword,
  getAllUsers,
} from "../controllers/user.controller";
import {
  validateUser,
  validateUserLogin,
  validateUserUpdatePassword,
} from "../validations/user.validate";
import { userRole } from "../utils/variable.utils";
import { verifyOTP } from "../middlewares/otp.middleware";

const userRoutes = express.Router();

userRoutes.post("/signup", validateUser, userSignup);
userRoutes.patch(
  "/:id/role",
  protectRoute,
  restrictTo(userRole.admin),
  updateRole
);
userRoutes.patch(
  "/change-account-status/:id",
  protectRoute,
  restrictTo(userRole.admin),
  changeAccountStatus
);

userRoutes.post("/login", validateUserLogin, userLogin);
userRoutes.post("/logout", protectRoute, userLogout);
userRoutes.get('/users', getAllUsers);
userRoutes.patch(
  "/:id/updatepassword",
  protectRoute,
  validateUserUpdatePassword,
  updatePassword
);
userRoutes.post("/requestpasswordreset", requestPasswordReset);
userRoutes.post("/resetpassword", resetPassword);
userRoutes.get("/verify-email", verifyTokenMiddleware, verifyEmail);
userRoutes.get("/verify-otp", verifyOTP);
export default userRoutes;
