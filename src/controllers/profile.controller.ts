import { UserService } from "../services/user.services";
import { Request, Response } from "express";
import cloudinary  from "cloudinary"
import "../utils/cloudinary.utils";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in the request object
    const user = await UserService.getUserByid(userId);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const userWithoutPasswordId = { ...user.dataValues };
    delete userWithoutPasswordId.password;
    delete userWithoutPasswordId.id;

    return res.status(200).json({
      status: "success",
      data: userWithoutPasswordId,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the profile",
    });
  }
};


export const updateProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id; // Assuming user ID is available in the request object
      const user = await UserService.getUserByid(userId);
  
      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "User not found",
        });
      }

      const files = req.files as Express.Multer.File[];
      if (!files || files.length > 1 ) {
        return res.status(400).json({
          message: "Please upload at least 1 image and not exceeding 1"})
        }
  
        let imageUrls=[] as string[]
      await Promise.all(
        files.map(async (file) => {
          const result = await cloudinary.v2.uploader.upload(file.path);
          imageUrls.push(result.secure_url);
          return result.secure_url
          
        })
  
      );

      const { 
        firstName,
        lastName,
        phone,
        birthDate,
        gender, 
        preferredLanguage, 
        preferredCurrency, 
        whereYouLive, 
        billingAddress,
    }=req.body;
    const image=imageUrls[0];
    await user.update({ firstName, lastName, phone, gender, birthDate, preferredLanguage, preferredCurrency, whereYouLive, billingAddress,image });
      
      return res.status(200).json({
        status: "success",
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({
        status: "error",
        message: "An error occurred while updating the profile",
      });
    }
  };
  