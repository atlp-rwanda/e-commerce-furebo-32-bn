import express from 'express';
import { protectRoute, restrictTo, verifyToken } from '../middlewares/auth.middleware';
import { verifyEmail } from '../controllers/verifyUser.controller';
import { verifyTokenMiddleware } from '../middlewares/verifyToken.middleware';
import {
  updateRole,
  userSignup,
  userLogin,
  userLogout,
  changeAccountStatus,
  updatePassword
} from "../controllers/user.controller";

import { validateUser, validateUserLogin,validateUserUpdatePassword } from "../validations/user.validate";
import { userRole } from "../utils/variable.utils";

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
userRoutes.post('/logout', verifyToken, userLogout);
userRoutes.patch('/:id/updatepassword',protectRoute,validateUserUpdatePassword, updatePassword);
userRoutes.get('/verify-email',verifyTokenMiddleware, verifyEmail);
export default userRoutes;
