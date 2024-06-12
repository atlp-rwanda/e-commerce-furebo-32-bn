import express from 'express';
import { addToWishlist } from '../controllers/wishlist.controller';
import { protectRoute, restrictTo } from '../middlewares/auth.middleware';
import { userRole } from '../utils/variable.utils';

const router= express.Router();

router.post('/:productId',protectRoute,restrictTo(userRole.buyer),addToWishlist)

export default router;