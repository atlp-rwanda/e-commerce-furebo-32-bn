/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
import { Request, Response } from "express";
import UserProfile from "../database/models/UserProfile";

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const {
      name,
      gender,
      birthdate,
      preferredLanguage,
      preferredCurrency,
      whereYouLive,
      billingAddress,
    } = req.body;

    const userProfile = await UserProfile.findOne({ where: { userId } });

    if (!userProfile) {
      return res.status(404).json({
        status: "error",
        message: "User profile not found",
      });
    } else
      await userProfile.update({
        name,
        gender,
        birthdate,
        preferredLanguage,
        preferredCurrency,
        whereYouLive,
        billingAddress,
      });

    return res.status(200).json({
      status: "success",
      message: "User profile updated successfully",
      data: userProfile,
    });
  } catch (error) {
    console.error("Error updating profile", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating the profile",
    });
  }
};
