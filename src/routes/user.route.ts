import express from 'express';
import { userSignup,userLogout  } from '../controllers/user.controller';
import userLogin from '../controllers/user.controller';
import { validateUser,validateUserLogin } from '../validations/user.validate';
import { checkBlacklist } from '../middleware/checkBlacklist';

const userRoutes = express.Router();

userRoutes.post('/signup',validateUser,userSignup);
userRoutes.post('/login', validateUserLogin, userLogin);
userRoutes.post('/logout', checkBlacklist, userLogout);

export default userRoutes;