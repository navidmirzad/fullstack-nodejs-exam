import { Router } from 'express';
import { createOrder, getOrders } from '../../database/orderQueries.js';
import { authenticateToken } from '../../middleware/middleware.js';

const router = Router();

router.get('/api/orders', authenticateToken, async (req, res) => {
    const userId = req.user.id
    try {
        const orders = await getOrders(userId);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/api/orders', authenticateToken, async (req, res) => {
    const userId = req.user.id;  
    const { products } = req.body;
    try {
        const order = await createOrder(userId, products);
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


export default router;
