import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const databaseUrl = 'postgresql://e-commerce_owner:8tboPpTeM2ua@ep-nameless-thunder-a5mdoaz6.us-east-2.aws.neon.tech/e-commerce?sslmode=require';

if (!databaseUrl) {
  throw new Error("Database URL must be provided");
}

export const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
