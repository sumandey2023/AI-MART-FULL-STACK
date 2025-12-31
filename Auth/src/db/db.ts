import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO DB uri is not defined");
}

async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI!);
    console.log("DB is connected");
  } catch (error) {
    console.log(error);
  }
}

export default connectDB;
