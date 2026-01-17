import express from "express";
import {
  getCart,
  addItemsToCart,
  getCartItems,
  updateItem,
  deleteItem,
} from "../controller/cart.controller.js";

import createAuthMiddleware from "../middlewares/auth.middleware.js";
import { validateAddItemsToCart } from "../validator/validation.middleware.js";

const router = express.Router();

router.get("/", createAuthMiddleware(["user"]), getCart);

router.post(
  "/items",
  validateAddItemsToCart,
  createAuthMiddleware(["user"]),
  addItemsToCart,
);

router.get("/getItems", createAuthMiddleware(["user"]), getCartItems);
router.patch("/updateCart/:id", createAuthMiddleware(["user"]), updateItem);
router.delete(
  "/deleteCartItem/:id",
  createAuthMiddleware(["user"]),
  deleteItem,
);

export default router;
