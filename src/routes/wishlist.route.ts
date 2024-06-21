import express from 'express';
import { addToWishlist, deleteUserWishes, getUserWishes } from '../controllers/wishlist.controller';
import { protectRoute, restrictTo } from '../middlewares/auth.middleware';
import { userRole } from '../utils/variable.utils';

const router= express.Router();

router.post('/:productId',protectRoute,restrictTo(userRole.buyer),addToWishlist)
router.get('/',protectRoute,restrictTo(userRole.buyer,userRole.seller),getUserWishes)
router.delete('/',protectRoute,restrictTo(userRole.buyer),deleteUserWishes)

export default router;