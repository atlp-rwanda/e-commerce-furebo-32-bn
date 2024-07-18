import express from 'express';
import { generalstats } from '../controllers/productStats.controller';
import { protectRoute } from '../middlewares/auth.middleware';
// import { userRole } from '../utils/variable.utils';

const router= express.Router();

router.get('/',protectRoute,generalstats)

export default router;