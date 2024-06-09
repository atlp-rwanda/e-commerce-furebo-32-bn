import cron from 'node-cron';
import { UserService } from '../services/user.services';
import { sendEmail } from '../utils/email.utils';

const PASSWORD_EXPIRATION_DAYS = parseInt(process.env.PASSWORD_EXPIRATION_DAYS || '90');

const job=cron.schedule('0 0 * * *', async () => { // Runs every day at midnight
  try {
    const users = await UserService.getAllUsers();
    const now = new Date();

    for (const user of users) {
      const lastUpdate = new Date(user.updatedAt);
      const diffDays = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays >= PASSWORD_EXPIRATION_DAYS) {
        const updateLink = `${process.env.FRONTEND_URL}/${user.id}/updatepassword`;

        const subject = "Password Update Request";
        const text = `Please update your password by clicking on the following link: ${updateLink}`;
        const html = `<p>Please reset your password by clicking on the following link:</p><a href="${updateLink}">Update Password</a>`;
        await sendEmail(user.email, subject, text, html);
      }
    }
  } catch (error) {
    console.error("Error checking password expiration:", error);
  }
});

export { job };