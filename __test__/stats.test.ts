import { Request, Response } from 'express';
import { generalstats } from '../src/controllers/productStats.controller'; // Adjust the path as per your project structure
import * as productController from '../src/controllers/product.controller';

describe('generalstats controller', () => {
  it('should return general stats', async () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the functions from product.controller with appropriate mock data
    const mockProductStats = 10; // Example number, replace with actual mock data
    const mockExpiredProducts = 5; // Example number, replace with actual mock data
    const mockAvailableProducts = 15; // Example number, replace with actual mock data
    const mockStockLevel = 100; // Example number, replace with actual mock data

    jest.spyOn(productController, 'getProductStats').mockResolvedValue(mockProductStats);
    jest.spyOn(productController, 'getExpiredProductStats').mockResolvedValue(mockExpiredProducts);
    jest.spyOn(productController, 'getAvailableProductStats').mockResolvedValue(mockAvailableProducts);
    jest.spyOn(productController, 'getStockStats').mockResolvedValue(mockStockLevel);

    // Call the controller function
    await generalstats(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      productStats: mockProductStats,
      expiredProducts: mockExpiredProducts,
      availableProducts: mockAvailableProducts,
      stocklevel: mockStockLevel,
    });
  });
});
