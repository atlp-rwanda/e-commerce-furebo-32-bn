import { checkPasswordExpiry } from '../src/middlewares/checkPasswordExpiry.middleware';
import { UserService } from '../src/services/user.services';
import { Request, Response, NextFunction } from 'express';

jest.mock('../src/services/user.services');

describe('Check Password Expiry Middleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = { user: { id: 1 } } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  test('should return 401 if user is not authenticated', async () => {
    req.user = null;

    await checkPasswordExpiry(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "User not authenticated",
    });
  });

  test('should return 404 if user is not found', async () => {
    (UserService.getUserByid as jest.Mock).mockResolvedValue(null);

    await checkPasswordExpiry(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "User not found",
    });
  });

  test('should return 403 if password update is required', async () => {
    const mockUser = { id: 1, updatedAt: new Date(Date.now() - 91 * 24 * 60 * 60 * 1000) };
    (UserService.getUserByid as jest.Mock).mockResolvedValue(mockUser);

    await checkPasswordExpiry(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Password update is required to proceed with other actions",
    });
  });

  test('should call next if password update is not required', async () => {
    const mockUser = { id: 1, updatedAt: new Date() };
    (UserService.getUserByid as jest.Mock).mockResolvedValue(mockUser);

    await checkPasswordExpiry(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('should handle errors gracefully', async () => {
    (UserService.getUserByid as jest.Mock).mockRejectedValue(new Error('Database error'));

    await checkPasswordExpiry(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "An error occurred while checking password update",
    });
  });
});
