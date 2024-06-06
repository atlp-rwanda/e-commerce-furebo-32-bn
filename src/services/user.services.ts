/* eslint-disable no-return-await */
/* eslint-disable quotes */
/* eslint-disable import/prefer-default-export */
/* eslint-disable require-jsdoc */
import Profile, { ProfileAttributes } from '../database/models/Profile';
import User from '../database/models/user.model';
import { UserSignupAttributes, UserAttributes } from '../types/user.types';


export class UserService {
  static async register(user: UserSignupAttributes) {
    return await User.create(user);
  }
  
  static async updateUser(user: User) {
    return await user.save();
  }
  
  static async updateUserSetting(userId: number, updates: Partial<UserAttributes>): Promise<UserAttributes | null> {
    try {
      const user = await User.findByPk(userId);
      if (user) {
        await user.update(updates);
        return user.toJSON() as UserAttributes;
      }
      return null;
    } catch (error: any) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }
  static async getUserByEmail(email:string) {
    return  await User.findOne({ where: { email: email } });
  }
  
  static async getUserByid(id:string) {
    return await User.findOne({ where: { id: id } });
  }

  static async getProfileServices(userId: number) {
    try {
      const getProfile = await Profile.findOne({ where: { userId } });
      return getProfile;
    } catch (error) {
      throw new Error("Error during profile retrieval");
    }
  }

  static async updateProfileServices(
    userId: number,
    profileData: Partial<ProfileAttributes>
  ) {
    try {
      const profile = await Profile.findOne({ where: { userId } });

      if (!profile) {
        throw new Error("No Profile found");
      }

      await profile.update(profileData);
      return profile;
    } catch (error) {
      throw new Error("Error in updating profile");
    }
  }

  static async createProfileServices(
    userId: string,
    profileData: Partial<ProfileAttributes>
  ) {
    try {
      const profile = await Profile.create({ userId, ...profileData });
      return profile;
    } catch (error) {
      throw new Error("Error in updating profile");
    }
  }
}
