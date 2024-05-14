import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const database = process.env.DEV_DB_NAME ?? 'default_db';
const username = process.env.DEV_DB_USER ?? 'default_user';
const password = process.env.DEV_DB_PASS ?? '';
const host = process.env.DEV_DB_HOST ?? 'localhost';

if (!database || !username || !host) {
  throw new Error("Database name, username, and host must be provided");
}

export const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: 'postgres',
  dialectModule: pg,
});
