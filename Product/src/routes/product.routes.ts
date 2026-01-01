import express from "express";
import { createProduct } from "../controller/product.controller.js";
import createAuthMiddleware from "../middlewares/auth.middleware.js";
import { createProductValidator } from "../validator/product.validator.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  createAuthMiddleware(["admin", "seller"]),
  upload.array("images", 5),
  createProductValidator,
  createProduct
);

export default router;
