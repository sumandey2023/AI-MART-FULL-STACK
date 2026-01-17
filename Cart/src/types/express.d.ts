import { Types } from "mongoose";


declare global {
  namespace Express {
    interface User {
      _id: Types.ObjectId | string;
      username: string;
      email: string;
      role: "user" | "seller" | "admin";
      addresses?: Array<{
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
        isDefault?: boolean;
      }>;
    }
    interface Request {
      user: User;
    }
  }
}


