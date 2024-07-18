import { NextFunction, Request, Response } from "express";
import { OrderService } from "../services/order.services";

export const checkOrderOwner = async function(req: Request, res: Response, next: NextFunction) {
    try {
        const buyerId = req.user.id;
        const userRole = req.user.role; 
        const orderId = req.params.orderId;
        const order = await OrderService.getOrderByItsId(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (buyerId !== order.dataValues.buyerId && userRole !== 'admin') {
            return res.status(403).json({ message: "You don't have permission to access this order" });
        }

        next();
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
};