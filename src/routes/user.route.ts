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
<<<<<<< HEAD
  updateUser
=======
  requestPasswordReset,
  resetPassword
>>>>>>> main
} from "../controllers/user.controller";
import { validateUser, validateUserLogin,validateUserUpdatePassword} from "../validations/user.validate";
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
userRoutes.post('/logout',protectRoute, userLogout);
userRoutes.patch('/:id/updatepassword',protectRoute,validateUserUpdatePassword, updatePassword);
<<<<<<< HEAD
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
=======
userRoutes.post("/requestpasswordreset", requestPasswordReset);
userRoutes.post("/resetpassword", resetPassword);
>>>>>>> main
userRoutes.get('/verify-email',verifyTokenMiddleware, verifyEmail);
userRoutes.post('/updateUser', protectRoute, updateUser)
export default userRoutes;
