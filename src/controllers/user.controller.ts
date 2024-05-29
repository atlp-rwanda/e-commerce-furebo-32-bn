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
  console.log("===============================================");
  
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

export const changeAccountStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  let subject: string;
  let activationReason: string;

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

  if (user.isActive) {
    subject = "Account Enabled";
    activationReason = "You are allowed to login again";
  } else {
    subject = "Account Disabled";
    activationReason = req.body.activationReason;
  }

  const emailBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p style="font-size: 16px; color: #444;">Dear ${user.firstName + " " + user.lastName},</p>
      <p style="font-size: 16px; color: #444;">
        Your account associated with the email 
        <strong style="color: #000;">${user.email}</strong> 
        has been 
        <strong style="color: ${!user.isActive ? '#28a745' : '#dc3545'};">
          ${!user.isActive ? "activated" : "disabled"}
        </strong>.
      </p>
      <p style="font-size: 16px; color: #444;">
        Reason: 
        <span style="color: #007bff;">${activationReason}</span>
      </p>
      <p style="font-size: 16px; color: #444;">
        If you have any questions or need further assistance, please do not hesitate to contact our support team.
      </p>
      <p style="font-size: 16px; color: #444;">Best regards,</p>
      <p style="font-size: 16px; color: #444;">Your Company Name</p>
    </div>
  `;
  sendVerificationEmail(user.email, subject, "text", emailBody);

  user.isActive = !user.isActive
  await user.save();
  res.status(201).json({
    message: "Account status updated successfully",
    reason:activationReason
  });
};
