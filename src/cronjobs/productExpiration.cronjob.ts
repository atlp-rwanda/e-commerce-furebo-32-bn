import cron from 'node-cron';
import Product from '../database/models/Product.model';
import { Op } from 'sequelize';
import { productEventEmitter } from '../events/productEvents.event';

export const checkForExpiredProducts = async () => {
  const currentDate = new Date();

  try {
    const expiredProducts = await Product.findAll({
      where: {
        expireDate: { [Op.lt]: currentDate },
        expired: false,
      },
    });

    for (const product of expiredProducts) {
      product.expired = true;
      await product.save();
      productEventEmitter.emit('productExpired', product);
    }
  } catch (error) {
    console.error("Error checking product expiration:", error);
  }
};

// Run checkForExpiredProducts() at midnight every day
export const scheduleProductExpirationCheck = () => {
    cron.schedule('0 0 * * *', async () => {
      await checkForExpiredProducts();
    });
  };