import express from "express";
import {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  getProductsBySeller,
  deleteProduct,
} from "../controller/product.controller.js";
import createAuthMiddleware from "../middlewares/auth.middleware.js";
import { createProductValidator } from "../validator/product.validator.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

//POST /api/products/
router.post(
  "/",
  createAuthMiddleware(["admin", "seller"]),
  upload.array("images", 5),
  createProductValidator,
  createProduct
);

//GET /api/products/
router.get("/", getProducts);

//GET /api/products/:id
router.get("/:id", getProductById);

//PATCH /api/products/:id
router.patch("/:id", createAuthMiddleware(["admin", "seller"]), updateProduct);


//GET /api/products/seller
router.get(
  "/seller",
  createAuthMiddleware(["seller"]),
  getProductsBySeller
);

//DELETE /api/products/:id
router.delete(
  "/:id",
  createAuthMiddleware(["seller"]),
  deleteProduct
);
export default router;
