import User from "../database/models/user.model";
import { UserSignupAttributes } from "../types/user.types";

export class UserService {
  static async register(user: UserSignupAttributes) {
    return await User.create(user);
  }
  
  static async updateUser(user: User) {
    return await user.save();
  }

  static async getUserByEmail(email:string) {
    return  await User.findOne({ where: { email: email } });
  }
  
  static async getUserByid(id:string) {
    return await User.findOne({ where: { id: id } });
  }
<<<<<<< HEAD
  static async getAllUsers() {
    return await User.findAll();
  }
=======
>>>>>>> 12e7f19 (feat(Login via Google):User should be able to login by google)
}