import { productEventEmitter } from '../src/events/productEvents.event';
import { checkForExpiredProducts } from '../src/cronjobs/productExpiration.cronjob';
import Product from '../src/database/models/Product.model';
import { Op } from 'sequelize';

// Mocking cron.schedule
jest.mock('node-cron', () => ({
  schedule: jest.fn().mockImplementation((_, callback) => ({
    start: () => callback(),
    stop: jest.fn()
  }))
}));

jest.mock('../src/database/models/Product.model');
jest.mock('../src/events/productEvents.event');

describe('Product Expiration Cron Job', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  test('should mark products as expired and emit productExpired event', async () => {
    const currentDate = new Date();
    const mockProducts = [
      { id: 1, seller_id: 1, expireDate: new Date(currentDate.getTime() - 24 * 60 * 60 * 1000), expired: false, save: jest.fn() },
      { id: 2, seller_id: 2, expireDate: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), expired: false, save: jest.fn() } // not expired
    ];

    (Product.findAll as jest.Mock).mockResolvedValue([mockProducts[0]]);

    // Manually trigger the cron job callback
    await checkForExpiredProducts();

    expect(Product.findAll).toHaveBeenCalledWith({
      where: {
        expireDate: { [Op.lt]: expect.any(Date) },
        expired: false,
      },
    });

    expect(mockProducts[0].expired).toBe(true);
    expect(mockProducts[0].save).toHaveBeenCalled();
    expect(productEventEmitter.emit).toHaveBeenCalledWith('productExpired', mockProducts[0]);

    expect(mockProducts[1].expired).toBe(false);
    expect(mockProducts[1].save).not.toHaveBeenCalled();
    expect(productEventEmitter.emit).not.toHaveBeenCalledWith('productExpired', mockProducts[1]);
  });

  test('should handle errors gracefully', async () => {
    (Product.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

    // Manually trigger the cron job callback
    await checkForExpiredProducts();

    expect(Product.findAll).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith("Error checking product expiration:", expect.any(Error));
  });
});
