import mongoose from "mongoose";
import { ENV } from "../config/env.js";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log("DB is connected");
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
};

export default connectDB;
