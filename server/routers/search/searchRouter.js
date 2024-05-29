import { Router } from 'express';
const router = Router();

import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();


router.get('/api/search', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).send({ error: 'Query parameter is required' });
    }

    try {
        const [results] = await pool.query(
            'SELECT * FROM products WHERE team LIKE ? OR playerName LIKE ? OR country LIKE ? OR priceDKK LIKE ?',
            [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
        );
        res.json(results);
    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

export default router;
