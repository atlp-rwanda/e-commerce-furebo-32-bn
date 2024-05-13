import { Sequelize, Dialect } from 'sequelize';
import config from './config/config.json';

const { username, password, database, host, dialect } = config.development;

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect: dialect as Dialect,
});

export default sequelize;
