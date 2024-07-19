import { Request, Response } from "express";
import { UserSignupAttributes } from "../types/user.types";
import { UserService } from "../services/user.services";
import { generateToken,decodeToken } from "../utils/tokenGenerator.utils";
// import { sendEmaill } from "../utils/email.utils";
import { hashPassword, comparePassword } from "../utils/password.utils";
import { sendEmail } from "../utils/email.utils";
import passport from "passport";
import { sendOTP } from "../middlewares/otp.middleware";
import { AccountStatusMessages } from "../utils/variable.utils";
import { sendReasonEmail } from "../utils/sendReason.util";
import { addToBlacklist } from "../utils/tokenBlacklist";
import { passwordEventEmitter } from '../events/passwordEvents.event';

export const userSignup = async (req: Request, res: Response) => {
  try {
    const hashedpassword: any = await hashPassword(req.body.password);

    const user: UserSignupAttributes = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedpassword,
      role: req.body.role,
      phone: req.body.phone,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    const email = req.body.email;
    if (email == undefined) {
    }

    const createdUser = await UserService.register(user);
    const token = await generateToken(createdUser, "1d");

    const verificationLink = `${process.env.FRONTEND_URL}/api/users/verify-email?token=${token}`;
    const subject = "Email Verification";
    const text = `Please verify your email by clicking on the following link:${verificationLink}`;
    const html = `<p>Please verify your email by clicking on the following link:</p><a href="${verificationLink}">Verify Email</a>`;
    sendEmail(user.email, subject, text, html);

    //Emitting the password event when password is updated
    passwordEventEmitter.emit('passwordUpdated', user.id);

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
  const userWithoutPassword = { ...user.dataValues };
  delete userWithoutPassword.password;
  res.status(201).json({
    status: "success",
    message: "User role updated successfully",
    data: {
      user: userWithoutPassword,
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

    if (!user.isActive) {
      return res.status(403).json({
        status: "fail",
        message: "oops, This Account is deactivated",
      });
    }

    if (!user.verified) {
      const token = await generateToken(user, "1h");
      const verificationLink = `${process.env.FRONTEND_URL}/api/users/verify-email?token=${token}`;
      const subject = "Email Verification";
      const text = `Please verify your email by clicking on the following link:${verificationLink}`;
      const html = `<p>Please verify your email by clicking on the following link:</p><a href="${verificationLink}">Verify Email</a>`;
      sendEmail(user.email, subject, text, html);
      return res.status(403).json({
        message:
          "This user is not verified, Check your Email and verify email first",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        status: "fail",
        message: "oops, This Account is deactivated",
      });
    }

    if (!user.verified) {
      const token = await generateToken(user, "1h");
      const verificationLink = `${process.env.FRONTEND_URL}/api/users/verify-email?token=${token}`;
      const subject = "Email Verification";
      const text = `Please verify your email by clicking on the following link:${verificationLink}`;
      const html = `<p>Please verify your email by clicking on the following link:</p><a href="${verificationLink}">Verify Email</a>`;
      sendEmail(user.email, subject, text, html);
      return res.status(403).json({
        message:
          "This user is not verified, Check your Email and verify email first",
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

    if (user.role === "seller") {
      req.body.email = email;
      return sendOTP(req, res, () => {
        res.status(200).json({
          status: "success",
          message: "Login successful",
          token: token,
          data: {
            user: userWithoutPassword,
          },
        });
      });
    } else {
      return res.status(200).json({
        status: "success",
        message: "Login successful",
        token: token,
        data: {
          user: userWithoutPassword,
        },
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred during login",
    });
  }
};

//Logout Functionality controller

export const userLogout = (req: Request, res: Response) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

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
    const { oldPassword, newPassword} = req.body;
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


    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    //Emitting the password event when password is updated
    passwordEventEmitter.emit('passwordUpdated', user.id);
  
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

export const LoginViaGoogle=async (req:Request,res:Response)=>{
  const user = req.user as UserSignupAttributes;
  try {
      const token = await generateToken(user);
      res.status(200).json({ token });
  } 
  catch (error) {
      res.status(400).json({message:'Error while generating token'});}
}

export const googleRedirect= function(){
 return passport.authenticate('google',{
    successRedirect:'/api/google/token',
    failureRedirect:'/api/google/failure'
  })
}

export const googleAuthenticate=function(){
    return passport.authenticate('google',{scope:['email','profile']})
}

export const googleAuthFailed=function(_req:Request,res:Response){
  res.status(400).json({message:"Authentication failed"})
}

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await UserService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const resetToken = await generateToken(user);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const subject = "Password Reset Request";
    const text = `Please reset your password by clicking on the following link: ${resetLink}`;
    const html = `<p>Please reset your password by clicking on the following link:</p><a href="${resetLink}">Reset Password</a>`;

    await sendEmail(email, subject, text, html);

    return res.status(200).json({
      status: "success",
      message: "Password reset email sent",
      data: { token: resetToken }
    });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while requesting password reset",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const newPassword = req.body.newPassword;
    const token = req.query.token as string;
    const decoded: any = decodeToken(token);
    const user = await UserService.getUserByid(decoded.id);
   
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while resetting password",
    });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    const usersWithoutPasswords = users.map((user) => {
      const userWithoutPassword = { ...user.dataValues };
      delete userWithoutPassword.password;
      return userWithoutPassword;
    });
    return res.status(200).json({
      status: "success",
      data: {
        users: usersWithoutPasswords,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching users",
    });
  }
};

