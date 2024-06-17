
import { UserService } from '../src/services/user.services';
import { sendEmail } from '../src/utils/email.utils';
import { job } from '../src/cronjobs/passwordExpirationChecker.cronjob';


jest.mock('node-cron', () => ({
  schedule: jest.fn().mockImplementation((_, callback) => ({
    start: () => callback(),
    stop: jest.fn()
  }))
}));

jest.mock("../src/services/user.services");
jest.mock("../src/utils/email.utils");

describe('Password Expiration Cron Job', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  test('should send email to users whose passwords are expired', async () => {
    const mockUsers = [
      { id: 1, email: 'user1@example.com', updatedAt: new Date(Date.now() - 91 * 24 * 60 * 60 * 1000) }, // expired
      { id: 2, email: 'user2@example.com', updatedAt: new Date(Date.now() - 89 * 24 * 60 * 60 * 1000) }  // not expired
    ];

    (UserService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

    // Manually trigger the cron job callback
    await job.start();

    expect(UserService.getAllUsers).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(
      'user1@example.com',
      'Password Update Request',
      expect.any(String),
      expect.any(String)
    );
  });

  test('should handle errors gracefully', async () => {
    (UserService.getAllUsers as jest.Mock).mockRejectedValue(new Error('Database error'));

    // Manually trigger the cron job callback
    await job.start();

    expect(UserService.getAllUsers).toHaveBeenCalledTimes(1);
    expect(sendEmail).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith("Error checking password expiration:", expect.any(Error));
  });
});
