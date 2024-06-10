import express from "express";
import { Router } from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import { compare } from "bcrypt";
import {
  createUser,
  postRefreshToken,
  getRefreshTokens,
  deleteRefreshToken,
  getUser,
} from "../../database/authQueries.js";
import jwt from "jsonwebtoken";
import {
  authenticateToken,
  generateAccessToken,
} from "../../middleware/middleware.js";

const router = Router();
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;

router.get("/protected", authenticateToken, (req, res) => {
  res.status(200).json({ email: req.user.email });
});

router.post("/tokens", async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const currentRefreshTokens = await getRefreshTokens();
    // Check if the provided refreshToken exists in the database
    const tokenExists = currentRefreshTokens.some(
      (tokenData) => tokenData.refreshToken === refreshToken
    );

    if (!tokenExists) return res.sendStatus(403);

    jwt.verify(refreshToken, REFRESH_JWT_SECRET, async (err, user) => {
      if (err) return res.sendStatus(403);

      const accessToken = generateAccessToken(user);
      res.json({ accessToken: accessToken });
    });
  } catch (error) {
    console.error("Error checking refresh token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await createUser(email, password);

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "schuyler51@ethereal.email",
        pass: "FZXjpaDupTqUAtgv52",
      },
    });

    const msg = {
      from: '"fullstack-nodejs-exam" <nodejs@example.com>',
      to: email,
      subject: "User registration successful!",
      text: "This is a test email sent from node.js using nodemailer!",
    };

    let info = await transporter.sendMail(msg);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.status(201).json({
      message: "User created successfully and email sent!",
      user: user,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error creating user or sending email" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUser(email);
    if (!user) {
      return res.status(400).json({ message: "Authentication failed" });
    }
    const passwordMatch = await compare(password, user.password);
    if (passwordMatch) {
      const accessToken = generateAccessToken(user, JWT_SECRET);
      const refreshToken = jwt.sign(user, REFRESH_JWT_SECRET);
      await postRefreshToken(accessToken, refreshToken, email);
      res.json({
        email: email,
        token: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      res.status(401).json({ message: "Authentication failed" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/logout", async (req, res) => {
  const refreshToken = req.headers.authorization.split(" ")[1];
  if (!refreshToken) return res.sendStatus(401);

  try {
    await deleteRefreshToken(refreshToken);
    res.json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.json({ message: "Internal Server Error" });
  }
});

export default router;
