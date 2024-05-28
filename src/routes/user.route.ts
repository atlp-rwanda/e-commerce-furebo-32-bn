import express from 'express';
import { updateRole, userSignup } from '../controllers/user.controller';
import { protectRoute, restrictTo } from '../middlewares/auth.middleware';
import userLogin from '../controllers/user.controller';
import { validateUser,validateUserLogin } from '../validations/user.validate';

const userRoutes = express.Router();

userRoutes.post('/signup',validateUser,userSignup);
userRoutes.patch('/:id',protectRoute,restrictTo('admin'), updateRole);

userRoutes.post('/login', validateUserLogin, userLogin);
export default userRoutes;