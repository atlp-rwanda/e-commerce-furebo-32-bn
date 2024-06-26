import { DataTypes, Model, Optional } from 'sequelize';
import {sequelize} from '../config/sequelize.config';
import User from './user.model';

interface PostAttributes {
  id: string;
  userId: string;
  content: string;
  name: string;
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: string;

  public userId!: string;

  public content!: string;

  public name!: string;
}

Post.init(
  {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        onDelete: "CASCADE",
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