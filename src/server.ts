import app from './app';
import connectToDatabase from './database/config/database.config';
import dotenv from 'dotenv';

dotenv.config();

const PORT: number = parseInt(process.env.PORT || '5000');
connectToDatabase()
  .then(() => {
    console.log('Connected to the database');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  }
  )