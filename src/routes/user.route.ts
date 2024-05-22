import express from 'express';
import { userSignup } from '../controllers/user.controller';
import { validateUser } from '../validations/user.validate';

const userRoutes = express.Router();

userRoutes.post('/signup',validateUser,userSignup);

export default userRoutes;