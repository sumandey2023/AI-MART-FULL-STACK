import mongoose, { Schema, Document, Model } from "mongoose";
import type { IUser, IAddress } from "../types/auth.types.js";
export interface UserDocument extends IUser, Document {}

const addressSchema = new Schema<IAddress>({
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    fullName: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    role: {
      type: String,
      enum: ["user", "seller"],
      default: "user",
    },
    profilePic: {
      type: String,
      default:
        "https://ik.imagekit.io/oruoqrvqm/AIMart/default_profile_pic.webp?updatedAt=1759827350283",
    },
    addresses: [addressSchema],
  },
  { timestamps: true }
);

const UserModel: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  userSchema
);

export default UserModel;
