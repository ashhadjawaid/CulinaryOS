import express from 'express';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect as any); // Protect all order routes

router.get('/', getOrders);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
