import { ENV } from "./config/env.js";
import connectDB from "./db/db.js";
connectDB();
import express from "express";
import type { Express } from "express";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/product.routes.js";

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/products", productRoutes);

const PORT = ENV.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Product Service is running on port ${PORT}`);
});
