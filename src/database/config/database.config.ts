import { sequelize } from "./sequelize.config";

const connectToDatabase = async () => {
  const databaseConnection = sequelize

  try {
    await databaseConnection.authenticate();
    console.log('Connection has been established successfully.');
    return databaseConnection;
  } catch (err) {
    console.error('Unable to connect to the database:', err);
}
};
export default connectToDatabase