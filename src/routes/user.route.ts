import express from 'express';
import { protectRoute, restrictTo } from '../middlewares/auth.middleware';
import { verifyEmail } from '../controllers/verifyUser.controller';
import { verifyTokenMiddleware } from '../middlewares/verifyToken.middleware';
import {
  updateRole,
  userSignup,
  userLogin,
  userLogout,
  changeAccountStatus,
  updatePassword,
  requestPasswordReset,
  resetPassword
} from "../controllers/user.controller";
import { validateUser, validateUserLogin,validateUserUpdatePassword} from "../validations/user.validate";
import { userRole } from "../utils/variable.utils";

const userRoutes = express.Router();

userRoutes.post("/signup", validateUser, userSignup);
<<<<<<< HEAD
userRoutes.patch("/:id/role", protectRoute, restrictTo(userRole.admin), updateRole);
=======
userRoutes.patch("/:id", protectRoute, restrictTo(userRole.admin), updateRole);
>>>>>>> 12e7f19 (feat(Login via Google):User should be able to login by google)
userRoutes.patch(
  "/change-account-status/:id",
  protectRoute,
  restrictTo(userRole.admin),
  changeAccountStatus
);

<<<<<<< HEAD
userRoutes.post('/login', validateUserLogin,userLogin);
userRoutes.post('/logout',protectRoute, userLogout);
userRoutes.patch('/:id/updatepassword',protectRoute,validateUserUpdatePassword, updatePassword);
userRoutes.post("/requestpasswordreset",requestPasswordReset);
=======
userRoutes.post('/login', validateUserLogin, userLogin);
userRoutes.post('/logout',protectRoute, userLogout);
userRoutes.patch('/:id/updatepassword',protectRoute,validateUserUpdatePassword, updatePassword);
userRoutes.post("/requestpasswordreset", requestPasswordReset);
>>>>>>> 12e7f19 (feat(Login via Google):User should be able to login by google)
userRoutes.post("/resetpassword", resetPassword);
userRoutes.get('/verify-email',verifyTokenMiddleware, verifyEmail);
export default userRoutes;
