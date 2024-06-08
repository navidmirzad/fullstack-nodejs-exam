import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise();

async function getAdress(userId) {
    const [adress] = await pool.query('SELECT * FROM addresses WHERE user_id = ?', [userId]);
    return adress;
}

async function postAdress(userId, street, city, state, zip_code, country) {
    const [result] = await pool.query(
        'INSERT INTO addresses (user_id, street, city, state, zip_code, country) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE street = VALUES(street), city = VALUES(city), state = VALUES(state), zip_code = VALUES(zip_code), country = VALUES(country)',
        [userId, street, city, state, zip_code, country]
    );
    return result;
}

async function updateAdress(userId, street, city, state, zip_code, country) {
    const [result] = await pool.query(
        'UPDATE addresses SET street = ?, city = ?, state = ?, zip_code = ?, country = ? WHERE user_id = ?',
        [street, city, state, zip_code, country, userId]
    );
    return result;
}

export { pool, postAdress, getAdress, updateAdress };


