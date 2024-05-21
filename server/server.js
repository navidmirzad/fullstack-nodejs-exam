import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Bearer"],
  })
);

import authRouter from "./routers/auth/auth.js";
app.use(authRouter);

import productRouter from "./routers/products/productRouter.js";
app.use(productRouter);

const PORT = 8080;
app.listen(PORT, () => console.log("Server is running on PORT: " + PORT));
