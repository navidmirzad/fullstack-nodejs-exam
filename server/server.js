import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Bearer"],
  },
});

app.set('io', io);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Bearer"],
  })
);

import authRouter from "./routers/auth/auth.js";
app.use(authRouter);

import addressRouter from "./routers/address/addressRouter.js";
app.use(addressRouter);

import productRouter from "./routers/products/productRouter.js";
app.use(productRouter);

import orderRouter from "./routers/orders/orderRouter.js";
app.use(orderRouter);

import stripeRouter from "./routers/stripe/stripeRouter.js";
app.use(stripeRouter);

import searchRouter from "./routers/search/searchRouter.js";
app.use(searchRouter);

io.on("connection", (socket) => {
  console.log("Connected to client");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = 8080;
server.listen(PORT, () => console.log("Server is running on PORT: " + PORT));
