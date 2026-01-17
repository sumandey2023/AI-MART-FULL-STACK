import mongoose from "mongoose";
export interface IItems{
    product: mongoose.Types.ObjectId;
    quantity: number;
}

export interface ICart{
    user: mongoose.Types.ObjectId;
    items: IItems[];
}