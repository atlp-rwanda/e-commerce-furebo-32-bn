import User from "../database/models/user.model";
import { UserSignupAttributes } from "../types/user.types";

export class UserService {
  static async register(user: UserSignupAttributes) {
    return await User.create(user);
  }
  static async getUserByEmail(email:string) {
    return await User.findOne({ where: { email: email } });
  }
}