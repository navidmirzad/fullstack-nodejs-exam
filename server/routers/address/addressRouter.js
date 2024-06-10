import { Router } from 'express';
import { postAddress, getAddress, updateAddress } from '../../database/addressQueries.js';
import { authenticateToken } from '../../middleware/middleware.js';

const router = Router();

router.get('/api/address', authenticateToken, async (req, res) => {
    const userId = req.user.id; 
    try {
        const address = await getAddress(userId);
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/api/address', authenticateToken, async (req, res) => {
    const { street, city, state, zip_code, country } = req.body;
    const userId = req.user.id; 
    try {
        const address = await postAddress(userId, street, city, state, zip_code, country);
        res.status(200).json({ message: 'Address updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/api/address', authenticateToken, async (req, res) => {
    const { street, city, state, zip_code, country } = req.body;
    const userId = req.user.id;
    try {
        const address = await updateAddress(userId, street, city, state, zip_code, country);
        res.status(200).json({ message: 'Address updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


export default router;
