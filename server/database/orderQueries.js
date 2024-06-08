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

async function createOrder(userId, products) {
    const orderResult = await pool.query(
        "INSERT INTO orders (user_id, product_id, quantity) VALUES ?",
        [products.map((product) => [userId, product.id, product.quantity])]
    );
    return orderResult;
}

async function getOrders() {
    const [orders] = await pool.query("SELECT * FROM orders");
    return orders;
}


export { pool, createOrder, getOrders };
