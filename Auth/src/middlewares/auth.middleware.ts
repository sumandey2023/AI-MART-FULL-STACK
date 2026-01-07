import { ENV } from "../config/env.js";
import userModel from "../models/user.model.js";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

interface AuthJwtPayload extends JwtPayload {
  _id: string;
  role: "user" | "seller" | "admin";
  email: string;
  username: string;
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthJwtPayload;

    const user = await userModel.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export default authMiddleware;
