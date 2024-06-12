import { passwordEventEmitter } from '../src/events/passwordEvents.event';
import { UserService } from '../src/services/user.services';

jest.mock('../src/services/user.services');

describe('Password Event Emitter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update user\'s updatedAt field when passwordUpdated event is emitted', async () => {
    const mockUser = { id: 1, updatedAt: new Date(), save: jest.fn() };
    (UserService.getUserByid as jest.Mock).mockResolvedValue(mockUser);

    await new Promise<void>((resolve) => {
      passwordEventEmitter.emit('passwordUpdated', 1);
      process.nextTick(resolve);
    });

    expect(UserService.getUserByid).toHaveBeenCalledWith(1);
    expect(mockUser.save).toHaveBeenCalled();
    expect(mockUser.updatedAt).toEqual(expect.any(Date));
  });

  test('should handle errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (UserService.getUserByid as jest.Mock).mockRejectedValue(new Error('Database error'));

    await new Promise<void>((resolve) => {
      passwordEventEmitter.emit('passwordUpdated', 1);
      process.nextTick(resolve);
    });

    expect(UserService.getUserByid).toHaveBeenCalledWith(1);
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));

    consoleSpy.mockRestore();
  });
});
