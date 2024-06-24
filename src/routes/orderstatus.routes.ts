import express from 'express';
import { getOrderStatus, updateOrderStatus } from "../controllers/orderStatus.controller";
import { protectRoute, restrictTo } from '../middlewares/auth.middleware';
import { checkOrderOwner } from '../middlewares/order.middleware';
import { userRole } from '../utils/variable.utils';

const orderStatusroutes= express.Router();

orderStatusroutes.get('/order/:orderId/status',protectRoute,checkOrderOwner, getOrderStatus);
orderStatusroutes.patch('/order/:orderId/status',protectRoute, restrictTo(userRole.admin), updateOrderStatus);

export default orderStatusroutes;