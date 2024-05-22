import { Request, Response } from "express";
import { UserSignupAttributes } from "../types/user.types";
import { UserService } from "../services/user.services";
import { hashPassword } from "../utils/password.utils";
import { generateToken } from "../utils/tokenGenerator.utils";
import { sendVerificationEmail } from "../utils/email.utils";


import { comparePassword } from "../utils/password.utils";

export const userSignup = async (req: Request, res: Response) => {
  const subject = "Email Verification";
  const text = `Please verify your email by clicking on the following link:`;
  const html = `<p>Please verify your email by clicking on the following link:</p><a href="">Verify Email</a>`;

  try {
    const hashedpassword: any = await hashPassword(req.body.password);

    const user: UserSignupAttributes = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedpassword,
      role: req.body.role,
      phone: req.body.phone,
    };
    const email = req.body.email;
    if (email == undefined) {
    }

    const createdUser = await UserService.register(user);
    const token = await generateToken(createdUser);
    sendVerificationEmail(user.email, subject, text, html);

    return res.status(200).json({
      status: "success",
      message: "User created successfully",
      token: token,
      data: {
        user: createdUser,
      },
    });
  } catch (error) {
    console.log(error, "Error in creating account");
  }
};



const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const token = await generateToken(user);

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token: token,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred during login",
    });
  }
};

export default userLogin;
