import express from 'express';
import { userSignup,userLogout  } from '../controllers/user.controller';
import { validateUser } from '../validations/user.validate';
import { checkBlacklist } from '../middleware/checkBlacklist';

const userRoutes = express.Router();

userRoutes.post('/signup',validateUser,userSignup);
userRoutes.post('/logout', checkBlacklist, userLogout);

export default userRoutes;