import express from 'express';
import { updateRole, userSignup,userLogout } from '../controllers/user.controller';
import { protectRoute, restrictTo } from '../middlewares/auth.middleware';
import userLogin from '../controllers/user.controller';
import { validateUser,validateUserLogin } from '../validations/user.validate';
import { verifyToken } from '../middleware/authMiddleware';



const userRoutes = express.Router();

userRoutes.post('/signup',validateUser,userSignup);
userRoutes.patch('/:id',protectRoute,restrictTo('admin'), updateRole);

userRoutes.post('/login', validateUserLogin, userLogin);
userRoutes.post('/logout', verifyToken, userLogout);
export default userRoutes;