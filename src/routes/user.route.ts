import express from 'express';
import userLogin, { updateRole, userSignup } from '../controllers/user.controller';
import { protectRoute, restrictTo } from '../middlewares/auth.middleware';
import { validateUser, validateUserLogin } from '../validations/user.validate';
import { getProfileController, updateProfileController } from '../controllers/profile.controller';
import upload from '../utils/multer';
import isImageUploaded from '../helper/isImageUploaded';

const userRoutes = express.Router();

userRoutes.get(
  '/profile',
  protectRoute,
  getProfileController
);
userRoutes.post('/signup', validateUser, userSignup);
userRoutes.patch('/:id', protectRoute, restrictTo('admin'), updateRole);

userRoutes.post('/login', validateUserLogin, userLogin);

userRoutes.patch(
  '/profile',
  upload.single('profileImage'),
  // protectRoute,
  isImageUploaded,
  updateProfileController
);
export default userRoutes;
