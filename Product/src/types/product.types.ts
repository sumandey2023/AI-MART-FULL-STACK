import mongoose from "mongoose";

export interface IProductImage {
  url: string;
  thumbnail: string;
  id: string;
}

export interface IProduct {
  title: string;
  description?: string;
  price: number;
  currency?: "INR" | "USD";
  seller: mongoose.Types.ObjectId;
  images?: IProductImage[];
  category?: string;
  stock?: number;
}
