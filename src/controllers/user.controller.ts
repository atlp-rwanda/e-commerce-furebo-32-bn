import { Request, Response } from "express";
import { UserAttributes, UserSignupAttributes } from "../types/user.types";
import { UserService } from "../services/user.services";
import { hashPassword } from "../utils/password.utils";
import { generateToken } from "../utils/tokenGenerator.utils";
import { sendVerificationEmail } from "../utils/email.utils";
import { decodeUserToken } from "../utils/decode";
import User from "../database/models/user.model";
import { resetPasswordTemplate } from "../templates/resetPasswordTemplate";
import { resetPasswordConfirmation } from "../templates/resetPasswordConfirmation";

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

export const requestResetPassword = async (req: Request, res: Response) => {
  // @ts-ignore
  const user: UserAttributes = (req as any).user;

  try {
    const token = await generateToken(user);
    await sendVerificationEmail(
      user.email,
      "Reset Password",
      "Reset Password",
      resetPasswordTemplate(token)
    );
    return res.status(200).json({
      message:
        "verification email has been sent please refer to your email to reset your password",
      token: token,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.query;
  const { newPassword } = req.body;
  try {
    if (!token) {
      return res.status(403).json({
        message: "Token missing ",
      });
    }
    const decoded = (await decodeUserToken(token as never)) as {
      role: string;
      id: number;
      email: string;
    };

    const user = await UserService.getUserByEmail(decoded.email);

    if (!user) {
      return res.status(404).json({
        message: "User not found or jwt token expired",
      });
    } else {
      await User.update(
        { password: newPassword },
        { where: { email: user.email } }
      );

      await sendVerificationEmail(
        user.email,
        "Password ressested",
        "passsword done rest",
        resetPasswordConfirmation()
      );

      return res.status(200).json({
        message: "Password reset successfully",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
