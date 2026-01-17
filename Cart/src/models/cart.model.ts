import mongoose from "mongoose";
import { Document, Schema, Model } from "mongoose";
import type { ICart } from "../types/cart.types.js";

export interface CartDocument extends ICart,Document{};

const cartSchema = new Schema<CartDocument>(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        items:[
            {
                productId:{
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                },
                quantity:{
                    type: Number,
                    required: true,
                    default: 1,
                }
            }
        ]

    },
    {timestamps: true}
)

const CartModel: Model<CartDocument> = mongoose.model<CartDocument>(
  "Cart",
  cartSchema
);

export default CartModel;