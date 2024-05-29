import mysql from "mysql2";
import bcrypt from "bcrypt";
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

async function postRefreshToken(accessToken, refreshToken, email) {
  const [result] = await pool.query(
    "INSERT INTO tokens (accessToken, refreshToken, email) VALUES (?, ?, ?)",
    [accessToken, refreshToken, email]
  );
  return {
    email,
    accessToken,
    refreshToken,
  };
}

async function getRefreshTokens() {
  const [rows] = await pool.query("SELECT * FROM tokens");
  return rows;
}

async function deleteRefreshToken(refreshToken) {
  await pool.query("DELETE FROM tokens WHERE refreshToken = ?", [refreshToken]);
}

async function getUser(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
}

async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword]
  );
  return {
    id: result.insertId,
    email,
    password: hashedPassword,
  };
}

export {
  pool,
  createUser,
  postRefreshToken,
  getRefreshTokens,
  getUser,
  deleteRefreshToken,
};
