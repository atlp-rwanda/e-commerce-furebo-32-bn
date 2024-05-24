const dotenv = require("dotenv");

dotenv.config();
console.log("cheking env", process.env.IS_REMOTE);
module.exports = {
  development: {
    url: process.env.DB_URL,
    dialect: "postgres",
  },
  test: {
    url: process.env.DB_URL,
    dialect: "postgres",
    dialectOptions:
      process.env.IS_REMOTE === "true"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : null,
  },
  production: {
    url: process.env.DB_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
