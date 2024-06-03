import { Optional } from "sequelize";

export interface UserAttributes {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    password?: string;
    profileURL?: string;
    phone?: string;
    birthDate?: Date;
    verified?: boolean;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }


  export interface UserSignupAttributes
  extends Optional<
    UserAttributes,
    | "id"
    | "firstName"
    | "lastName"
    | "password"
    | "email"
    | "role"
    | "phone"
  > {}

export interface UserOutputs extends Required<UserAttributes> {}