import User from "../database/models/user.model";
import { UserSignupAttributes } from "../types/user.types";

export class UserService {
  static async register(user: UserSignupAttributes) {
    return await User.create(user);
  }

  static async updateUser(user: User) {
    return await user.save();
  }

  static async getUserByEmail(email: string) {
    return await User.findOne({
      where: { email: email },
    });
  }

  static async getUserByid(id: string) {
    return await User.findOne({ where: { id: id } });
  }
  static async getAllUsers() {
    return await User.findAll();
  }
  static async updateRole(id: string, role: string) {
    const user = await UserService.getUserByid(id);
    if (user) {
      user.role = role;
      await user.save();
      return user;
    }
    return null;
  }
}
