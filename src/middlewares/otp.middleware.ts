import crypto from "crypto";
import { sendEmail } from "../utils/email.utils";
import { Request, Response, NextFunction } from "express";

interface OTPStore {
  [key: string]: {
    otp: string;
    expiry: number;
  };
}

const otpStore: OTPStore = {}; // Store OTPs with expiry times

function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString().padStart(6, "0");
}

export const sendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json("Email is required");
    return;
  }

  const otp = generateOTP();
  const expiry = Date.now() + 300000; // OTP valid for 5 minutes

  otpStore[email] = { otp, expiry };

  const subject = "OTP Verification";
  const text = `Please verify your email by entering this OTP: "${otp}"`;
  const html = `
    <p>Please verify your email by entering this OTP:</p>
    <b>${otp}</b>
  `;

  try {
    sendEmail(email, subject, text, html);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json("Error sending OTP email");
  }

  next();
};

export const verifyOTP = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    res.status(400).json("Email and OTP are required");
    return;
  }

  const otpData = otpStore[email];

  if (!otpData) {
    res.status(400).json({message: "OTP not found or expired"});
    return;
  }

  if (Date.now() > otpData.expiry) {
    res.status(400).json({message: "OTP expired"});
    return;
  }

  if (otpData.otp !== otp) {
    res.status(400).json({message: "Invalid OTP"});
    return;
  }

  delete otpStore[email]; // OTP verified, remove from store
  res.status(200).json({message: "OTP verified successfully"});
  next();
};
