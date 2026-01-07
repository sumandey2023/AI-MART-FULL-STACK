import mongoose from "mongoose";
import { Document, Schema, Model } from "mongoose";
import type { IProduct } from "../types/product.types.js";
export interface ProductDocument extends IProduct, Document {}

const productSchema = new Schema<ProductDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["INR", "USD"],
      default: "INR",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    images: [
      {
        url: String,
        thumbnail: String,
        id: String,
      },
    ],
    category: {
      type: String,
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const ProductModel: Model<ProductDocument> = mongoose.model<ProductDocument>(
  "Product",
  productSchema
);

export default ProductModel;
