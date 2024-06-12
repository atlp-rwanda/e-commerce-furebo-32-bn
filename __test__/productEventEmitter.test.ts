import { productEventEmitter } from '../src/events/productEvents.event';
import { UserService } from '../src/services/user.services';
import { sendEmail } from '../src/utils/email.utils';

jest.mock('../src/services/user.services');
jest.mock('../src/utils/email.utils');

describe('Product Event Emitter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  test('should send email to seller when productExpired event is emitted', async () => {
    const mockProduct = { id: 1, seller_id: 1, productName: 'Test Product' };
    const mockSeller = { id: 1, email: 'seller@example.com', firstName: 'Seller' };

    (UserService.getUserByid as jest.Mock).mockResolvedValue(mockSeller);

    await new Promise<void>((resolve) => {
      productEventEmitter.emit('productExpired', mockProduct);
      process.nextTick(resolve);
    });

    expect(UserService.getUserByid).toHaveBeenCalledWith(mockProduct.seller_id);
    expect(sendEmail).toHaveBeenCalledWith(
      mockSeller.email,
      'Product Expired',
      expect.any(String),
      expect.any(String)
    );
  });

  test('should handle errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockProduct = { id: 1, seller_id: 1, productName: 'Test Product' };

    (UserService.getUserByid as jest.Mock).mockRejectedValue(new Error('Database error'));

    await new Promise<void>((resolve) => {
      productEventEmitter.emit('productExpired', mockProduct);
      process.nextTick(resolve);
    });

    expect(UserService.getUserByid).toHaveBeenCalledWith(mockProduct.seller_id);
    expect(sendEmail).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith("Error sending expiration email: Error: Database error");

    consoleSpy.mockRestore();
  });
});
