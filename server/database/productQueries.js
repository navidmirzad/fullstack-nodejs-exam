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

async function getJerseys() {
  const [result] = await pool.query("SELECT * FROM products");
  return result;
}

async function getJersey(id) {
  const [result] = await pool.query("SELECT * FROM products WHERE id = ?", [
    id,
  ]);
  return result[0];
}

export { pool, getJerseys, getJersey };
