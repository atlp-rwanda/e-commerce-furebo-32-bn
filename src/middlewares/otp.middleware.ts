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
  return crypto.randomInt(100000, 999999).toString();
}

export const sendOTP = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const subject = "OTP Verification";
  const text = `Please verify your email by entering this OTP: "${generateOTP()}"`;
  const html = `<p>Please verify your email by entering this OTP:</p><b>${generateOTP()}</b>`;

  const { email } = req.body;
  if (!email) {
    res.status(400).send("Email is required");
    return;
  }

  const otp = generateOTP();
  const expiry = Date.now() + 300000; // OTP valid for 5 minutes

  otpStore[email] = { otp, expiry };

  sendEmail(email, subject, text, html);

  next();
};

export const verifyOTP = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    res.status(400).send("Email and OTP are required");
    return;
  }

  const otpData = otpStore[email];

  if (!otpData) {
    res.status(400).send("OTP not found or expired");
    return;
  }

  if (Date.now() > otpData.expiry) {
    res.status(400).send("OTP expired");
    return;
  }

  if (otpData.otp !== otp) {
    res.status(400).send("Invalid OTP");
    return;
  }

  delete otpStore[email]; // OTP verified, remove from store
  next();
};
