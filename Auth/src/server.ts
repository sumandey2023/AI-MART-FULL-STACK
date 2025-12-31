import express from "express";
import type { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";
import router from "./routes/auth.routes.js";

connectDB();

const app: Express = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", router);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
