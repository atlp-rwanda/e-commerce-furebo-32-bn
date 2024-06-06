/* eslint-disable object-curly-newline */
/* eslint-disable quotes */
/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import { UserService } from '../services/user.services';
import uploadFile from '../helper/imageUploader';



export const getProfileController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const profile = await UserService.getProfileServices(userId);

    if (!profile) {
      res.status(404).json({ status: 404, message: "profile not found!" });
    } else {
      const { dataValues } = profile;
      const {email, ...filteredProfile } = dataValues;
      res.status(200).json(filteredProfile);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};



export const updateProfileController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const profileData = req.body;
    const { file } = req.body;
    let profileImage;

    if (file) {
      profileImage = await uploadFile(file);
    } else if (Object.keys(profileData).length === 0) {
      return res.status(400).json({
        status: 400,
        message: 'Cannot update with empty profile data',
      });
    } else {
      profileImage = '';
    }
    const updatedProfile = await UserService.updateProfileServices(userId, {
      ...profileData,
      profileImage,
    });
    res.status(200).json({
      status: 200,
      message: 'You updated your profile sucessfully!',
      updatedProfile,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
