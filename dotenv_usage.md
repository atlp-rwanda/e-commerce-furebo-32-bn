# Using dotenv in Your API
~
## Setup
1. Create a `.env` file in the root directory of your project.
2. Define your environment variables inside the `.env` file using the `KEY=VALUE` format. You can use `.env.example` as a reference.

## Usage
1. Load dotenv in your application's entry point: 
   ***import dotenv from "dotenv";
      dotenv.config();***
2.Access environment variables anywhere in your code using `process.env.VARIABLE_NAME`.
3.For packages like Sequelize, use process.env to fetch database connection details.
4.For authentication middleware like Passport, use process.env to fetch sensitive information like API keys and secrets.