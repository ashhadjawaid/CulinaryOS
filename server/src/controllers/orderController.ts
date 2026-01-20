import { Request, Response } from 'express';
import { Order } from '../models/Order';

interface AuthRequest extends Request {
    user?: { id: string };
}

export const getOrders = async (req: AuthRequest, res: Response) => {
    try {
        console.log('Fetching orders for user:', req.user?.id);
        const orders = await Order.find({ user: req.user?.id }).sort({ startTime: 1 });
        console.log('Orders found:', orders.length);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        console.log('Creating order with body:', req.body);
        const { title, specifications, startTime, endTime, duration } = req.body;

        const newOrder = new Order({
            user: req.user?.id,
            title,
            specifications,
            startTime,
            endTime,
            duration,
        });

        await newOrder.save();
        console.log('Order created successfully:', newOrder._id);
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error creating order' });
    }
};

export const updateOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: id, user: req.user?.id },
            req.body,
            { new: true }
        );

        if (!updatedOrder) {
            console.log('Order not found for update:', id);
            return res.status(404).json({ message: 'Order not found' });
        }
        console.log('Order updated:', updatedOrder._id);
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Server error updating order' });
    }
};

export const deleteOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findOneAndDelete({ _id: id, user: req.user?.id });

        if (!deletedOrder) {
            console.log('Order not found for delete:', id);
            return res.status(404).json({ message: 'Order not found' });
        }
        console.log('Order deleted:', id);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Server error deleting order' });
    }
};
