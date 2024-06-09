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

async function getOrders(userId) {
  const [orders] = await pool.query(
      `SELECT orders.id as order_id, orders.order_date, orders.quantity, 
              products.id as product_id, products.name as product_name, products.priceDKK, 
              products.team, products.playerName 
       FROM orders 
       JOIN products ON orders.product_id = products.id 
       WHERE orders.user_id = ?`, 
      [userId]
  );

  const formattedOrders = orders.reduce((acc, order) => {
      const orderIndex = acc.findIndex(o => o.id === order.order_id);
      const product = {
          id: order.product_id,
          name: order.product_name,
          priceDKK: order.priceDKK,
          team: order.team,
          playerName: order.playerName,
          quantity: order.quantity,
      };
      if (orderIndex > -1) {
          acc[orderIndex].products.push(product);
      } else {
          acc.push({
              id: order.order_id,
              order_date: order.order_date,
              products: [product],
          });
      }
      return acc;
  }, []);
  
  return formattedOrders;
}


export { pool, createOrder, getOrders };
