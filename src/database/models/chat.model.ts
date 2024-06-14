import { DataTypes, Model, Optional } from 'sequelize';
import {sequelize} from '../config/sequelize.config';
import User from './user.model';

interface PostAttributes {
  id: number;
  userId: number;
  content: string;
  name: string;
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;

  public userId!: number;

  public content!: string;

  public name!: string;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },  
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Posts',
  },
);

export default Post;