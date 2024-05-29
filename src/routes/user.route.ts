import express from 'express';
import { userSignup,updateRole,userLogout  } from '../controllers/user.controller';
import { protectRoute, restrictTo } from '../middlewares/auth.middleware';
import userLogin from '../controllers/user.controller';
import { validateUser,validateUserLogin } from '../validations/user.validate';
import { checkBlacklist } from '../middleware/checkBlacklist';

const userRoutes = express.Router();

userRoutes.post('/signup',validateUser,userSignup);
userRoutes.patch('/:id',protectRoute,restrictTo('admin'), updateRole);

userRoutes.post('/login', validateUserLogin, userLogin);
userRoutes.post('/logout', checkBlacklist, userLogout);

export default userRoutes;