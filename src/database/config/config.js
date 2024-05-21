const dotenv = require("dotenv");
const pg = require("pg");
dotenv.config();

module.exports = {
  development: {
    url: `postgres://${process.env.DEV_DB_USER}:${process.env.DEV_DB_PASS}@${process.env.DEV_DB_HOST}/${process.env.DEV_DB_NAME}`,
    dialect: 'postgres',
    dialectModule: pg,
  },
  test: {
    url: `postgres://${process.env.TEST_DB_USER}:${process.env.TEST_DB_PASS}@${process.env.TEST_DB_HOST}/${process.env.TEST_DB_NAME}`,
    dialect: 'postgres',
    dialectModule: pg,
  },
  production: {
    url: `postgres://${process.env.PRO_DB_USER}:${process.env.PRO_DB_PASS}@${process.env.PRO_DB_HOST}/${process.env.PRO_DB_NAME}`,
    dialect: 'postgres',
    dialectModule: pg,
  },
};