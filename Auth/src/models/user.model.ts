import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  isDefault?: boolean;
}

const addressSchema = new Schema<IAddress>({
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  isDefault: { type: Boolean, default: false },
});

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
  role: "user" | "seller";
  profilePic?: string;
  addresses: IAddress[];
}

const userSchema = new Schema<IUser>(
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

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default UserModel;
