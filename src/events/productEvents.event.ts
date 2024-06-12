import { EventEmitter } from 'events';
import Product from "../database/models/Product.model";
import { sendEmail } from '../utils/email.utils';
import { UserService } from '../services/user.services';
export const productEventEmitter = new EventEmitter();

productEventEmitter.on('productExpired', async (product: Product) => {
    try {
        const seller = await UserService.getUserByid(product.seller_id);
        if (seller) {
            const subject = 'Product Expired';
            const text = `Dear ${seller.firstName},\n\nYour product "${product.productName}" has expired and is no longer listed as available.\n\nRegards,\nYour Company Name`;
            const html = `<p>Dear ${seller.firstName},</p><p>Your product "<strong>${product.productName}</strong>" has expired and is no longer listed as available.</p>`;
            
            await sendEmail(seller.email, subject, text, html);
            console.log(`Expiration email sent to ${seller.email}`);
        }
    } catch (error) {
        console.error(`Error sending expiration email: ${error}`);
    }
});
