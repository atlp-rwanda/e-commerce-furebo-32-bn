import express from 'express';
import { userSignup } from '../controllers/user.controller';
import userLogin from '../controllers/user.controller';
import { validateUser,validateUserLogin } from '../validations/user.validate';

const userRoutes = express.Router();

userRoutes.post('/signup',validateUser,userSignup);
userRoutes.post('/login', validateUserLogin, userLogin);
export default userRoutes;