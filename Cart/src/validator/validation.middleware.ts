import type { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";


const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
};


const validateAddItemsToCart = [
  body("productId")
    .isString()
    .notEmpty()
    .withMessage("Product ID is required")
    .custom((value: string) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Product ID"),

  body("quantity")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be an integer greater than 0"),

  validateRequest,
];

export { validateAddItemsToCart };
