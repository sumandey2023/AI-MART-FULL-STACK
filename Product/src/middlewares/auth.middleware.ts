import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { ENV } from "../config/env.js";


interface AuthJwtPayload extends JwtPayload {
  _id: string;
  role: "user" | "seller" | "admin";
  email: string;
  username: string;
}


const createAuthMiddleware = (
  roles: Array<AuthJwtPayload["role"]> = ["user"]
) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    try {
      const token =
        req.cookies?.token ?? req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthJwtPayload;

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = decoded; 
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

export default createAuthMiddleware;
