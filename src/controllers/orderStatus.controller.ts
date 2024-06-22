import { Request, Response } from "express";
import { getSocket } from '../socketio';
import { OrderService } from "../services/order.services";
import { validStatus } from '../utils/variable.utils';

export const getOrderStatus = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const orderId = req.params.orderId;

        const order = await OrderService.getOrderByItsId(orderId);
        if (!user) {
            return res.status(404).send({ message: 'The order is not yours' });
        }
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        const ioServer = getSocket();
        ioServer.emit('orderStatusRetrieved', { orderId, status: order.dataValues.status, expectedDeliveryDate: order.dataValues.expectedDeliveryDate });

        res.status(200).json({ orderId, status: order.dataValues.status, expectedDeliveryDate: order.dataValues.expectedDeliveryDate });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        let updatedOrder:any
        const orderId = req.params.orderId;
        const status = req.body.status;

        if (!validStatus.includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const order = await OrderService.getOrderByItsId(orderId);

        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }

        if (status === 'processing') {
            const currentDate = new Date();
            const expectedDeliveryDate = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000));
        updatedOrder =await OrderService.updateOrderStatusAsAdmin(orderId,status,expectedDeliveryDate)
        }

        updatedOrder =await OrderService.updateOrderStatusAsAdmin(orderId,status,null)

        const ioServer = getSocket();
        ioServer.emit('orderStatusUpdated', {
            orderId,
            status: updatedOrder.dataValues.status,
            expectedDeliveryDate: updatedOrder.dataValues.expectedDeliveryDate
        });

        res.status(200).json({
            status: "success",
            message: "Order Status updated successfully",
            data: {
                orderId,
                status: updatedOrder.dataValues.status,
                expectedDeliveryDate: updatedOrder.dataValues.expectedDeliveryDate
            }
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
