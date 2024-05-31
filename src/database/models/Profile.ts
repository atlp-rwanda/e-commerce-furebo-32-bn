/* eslint-disable no-trailing-spaces */
/* eslint-disable lines-between-class-members */
/* eslint-disable indent */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.config';

export interface ProfileAttributes {
  id?: number;
  userId?: string;
  profileImage?: string;
  fullName?: string;
  email?: string;
  gender?: string;
  birthdate?: string;
  preferredLanguage?: string;
  preferredCurrency?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

class Profile extends Model<ProfileAttributes> implements ProfileAttributes {
  id!: number;
  userId!: string;
  profileImage!:string;
  fullName!: string;
  email!: string;
  gender!: string;
  birthdate!: string;
  preferredLanguage!: string;
  preferredCurrency!: string;
  street!: string;
  city!: string;
  state!: string;
  postalCode!: string;
  country!: string;
    length: any;
}

Profile.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'User',
      key: 'id'
    },
    allowNull: true,
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
   type: DataTypes.STRING,
   allowNull: true
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  birthdate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  preferredLanguage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  preferredCurrency: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  }, 
}, {
  sequelize,
  modelName: 'Profile', 
  tableName: 'profiles', 
});

export default Profile;
