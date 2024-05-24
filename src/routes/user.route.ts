import express from "express";
import {
  requestResetPassword,
  resetPassword,
  userSignup,
} from "../controllers/user.controller";
import { validateUser } from "../validations/user.validate";
import { isUserFound } from "../middlewares/isUserFound";

const userRoutes = express.Router();

userRoutes.post("/signup", validateUser, userSignup);
userRoutes.post("/request-reset-password", isUserFound, requestResetPassword);
userRoutes.post("/reset-password", resetPassword);

export default userRoutes;
