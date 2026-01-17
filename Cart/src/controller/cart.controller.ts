import CartModel from "../models/cart.model.js";
import mongoose from "mongoose";
import type { Request, Response } from "express";
import type {
  AddItemDTO,
  UpdateProductParams,
  UpdateProductQuantityDTO,
} from "../types/cart.dto.js";

const getCart = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = req.user;

    let cart = await CartModel.findOne({ user: user._id });

    if (!cart) {
      cart = new CartModel({ user: user._id, items: [] });
      await cart.save();
    }

    return res.status(200).json({
      cart,
      totals: {
        itemCount: cart.items.length,
        totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const addItemsToCart = async (
  req: Request<{}, {}, AddItemDTO>,
  res: Response,
): Promise<Response> => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
      });
    }

    let cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      cart = new CartModel({
        user: userId,
        items: [],
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (existingItemIndex > -1) {
      const existingItem = cart.items[existingItemIndex];

      if (existingItem) {
        existingItem.quantity += quantity;
      }
    } else {
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId),
        quantity,
      });
    }

    await cart.save();

    return res.status(200).json({
      message: "Items added to cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getCartItems = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = req.user;
    let cart = await CartModel.findOne({ user: user._id });
    if (!cart) {
      cart = new CartModel({ user: user._id, items: [] });
      await cart.save();
    }

    return res.status(200).json({
      message: "Cart items fetched successfully",
      cart,
      totals: {
        itemCount: cart.items.length,
        totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateItem = async (
  req: Request<{ id?: string }, {}, UpdateProductQuantityDTO>,
  res: Response,
): Promise<Response> => {
  try {
    const userId = req.user._id;
    const itemId = req.params.id;
    const { quantity } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
      });
    }

    const cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === itemId,
    );

    if (itemIndex < 0) {
      return res.status(404).json({
        message: "Item not found in cart",
      });
    }

    const cartItem = cart.items[itemIndex];
    if (!cartItem) {
      return res.status(404).json({
        message: "Item not found in cart",
      });
    }

    cartItem.quantity = quantity;

    await cart.save();

    return res.status(200).json({
      message: "Item quantity updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Update cart item error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteItem = async (
  req: Request<{ id?: string }>,
  res: Response,
): Promise<Response> => {
  try {
    const userId = req.user._id;
    const itemId = req.params.id;

    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    const cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === itemId,
    );

    if (itemIndex < 0) {
      return res.status(404).json({
        message: "Item not found in cart",
      });
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    return res.status(200).json({
      message: "Item removed from cart successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { getCart, addItemsToCart, getCartItems, updateItem, deleteItem };
