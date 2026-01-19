import { ENV } from "./config/env.js";
import connectDB from "./db/db.js";
connectDB();
import express from "express";
import type { Express } from "express";
import cookieParser from "cookie-parser";
import cartRoutes from "./routes/cart.routes.js";

const app: Express = express();
app.use(cookieParser());
app.use(express.json());
app.use("/api/cart", cartRoutes);

const PORT = ENV.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Cart Service is running on port ${PORT}`);
});
