import { Optional } from "sequelize";

export interface UserAttributes {
    id?: string;
    image?: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    email?: string;
    role?: string;
    password?: string;
    profileURL?: string;
    phone?: string;
    birthDate?: Date;
    preferredLanguage?: string;
    preferredCurrency?: string;
    whereYouLive?: string;
    billingAddress?: string;
    verified?: boolean;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }


  export interface UserSignupAttributes
  extends Optional<
    UserAttributes,
    | "id"
    | "image"
    | "firstName"
    | "lastName"
    | "gender"
    | "password"
    | "preferredLanguage"
    | "preferredCurrency"
    | "email"
    | "whereYouLive"
    | "billingAddress"
    | "role"
    | "phone"
    | "updatedAt"
  > {}

export interface UserOutputs extends Required<UserAttributes> {}