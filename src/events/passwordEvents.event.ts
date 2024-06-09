import { EventEmitter } from 'events';
import { UserService } from '../services/user.services';

export const passwordEventEmitter = new EventEmitter();

passwordEventEmitter.on('passwordUpdated', async (userId) => {
  try {
    const user = await UserService.getUserByid(userId);
    if (user) {
      user.updatedAt = new Date();
      await user.save();
    }
  } catch (error) {
    console.error(error);
  }
});
