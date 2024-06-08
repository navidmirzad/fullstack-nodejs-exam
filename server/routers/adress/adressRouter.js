import { Router } from 'express';
import { postAdress, getAdress, updateAdress } from '../../database/adressQueries.js';
import { authenticateToken } from '../../middleware/middleware.js';

const router = Router();

router.post('/api/address', authenticateToken, async (req, res) => {
    const { street, city, state, zip_code, country } = req.body;
    const userId = req.user.id; // Ensure the user ID is extracted from the token
    try {
        const address = await postAdress(userId, street, city, state, zip_code, country);
        res.status(200).json({ message: 'Address updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/api/address', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Ensure the user ID is extracted from the token
    try {
        const address = await getAdress(userId);
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/api/address', authenticateToken, async (req, res) => {
    const { street, city, state, zip_code, country } = req.body;
    const userId = req.user.id;
    try {
        const address = await updateAdress(userId, street, city, state, zip_code, country);
        res.status(200).json({ message: 'Address updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


export default router;
