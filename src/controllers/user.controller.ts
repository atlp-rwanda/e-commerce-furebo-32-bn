import { Request, Response } from "express";
import { UserSignupAttributes } from "../types/user.types";
import { UserService } from "../services/user.services";
import { hashPassword } from "../utils/password.utils";
import { generateToken } from "../utils/tokenGenerator.utils";
import { sendVerificationEmail } from "../utils/email.utils";
import { addToBlacklist } from '../utils/tokenBlacklist';

import { comparePassword } from "../utils/password.utils";
import { AccountStatusMessages } from "../utils/variable.utils";
import { sendReasonEmail } from "../utils/sendReason.util";

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
    const userWithoutPassword = { ...createdUser.dataValues };
    delete userWithoutPassword.password;

    return res.status(200).json({
      status: "success",
      message: "User created successfully",
      token: token,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.log(error, "Error in creating account");
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const id = req.params.id;
  const role = req.body.role;
  const user = await UserService.getUserByid(id);
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
  user.role = role;
  user?.save();
  res.status(201).json({
    status: "success",
    message: "User role updated successfully",
    data: {
      user: user,
    },
  });
};

//User Login Controller
export const userLogin = async (req: Request, res: Response) => {
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
    const userWithoutPassword = { ...user.dataValues };
    delete userWithoutPassword.password;

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token: token,
      data: {
        user: userWithoutPassword,
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

//Logout Functionality

export const userLogout = (req: Request, res: Response) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      addToBlacklist(token); 
    }

    return res.status(200).json({
      status: "success",
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred during logout",
    });
  }
};
export const changeAccountStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await UserService.getUserByid(id);

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  if (user.isActive && !req.body.activationReason) {
    return res.status(403).json({
      status: "fail",
      message: "Activation reason is required",
    });
  }

  const subject = !user.isActive
    ? AccountStatusMessages.ACCOUNT_ENABLED_SUBJECT
    : AccountStatusMessages.ACCOUNT_DISABLED_SUBJECT;
  const activationReason = !user.isActive
    ? AccountStatusMessages.DEFAULT_ACTIVATION_REASON
    : req.body.activationReason;

  sendReasonEmail(user, subject, activationReason, user.isActive);

  user.isActive = !user.isActive;
  await user.save();

  res.status(201).json({
    message: "Account status updated successfully",
    reason: activationReason,
  });
};
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const id = req.params.id;

    // Fetch the user by ID
    const user = await UserService.getUserByid(id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // Validate the old password
    const isPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "fail",
        message: "Enter correct old password",
      });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        status: "fail",
        message: "New password and confirm password do not match",
      });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Respond with success
    return res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating the password",
    });
  }
};