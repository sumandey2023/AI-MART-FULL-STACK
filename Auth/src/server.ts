import { ENV } from "./config/env.js";
import express from "express";
import type { Express } from "express";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";
import router from "./routes/auth.routes.js";

connectDB();

const app: Express = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", router);
const PORT = ENV.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Auth service is running on port ${PORT}`);
});
