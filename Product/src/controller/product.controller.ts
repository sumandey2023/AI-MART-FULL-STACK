import type { Request, Response } from "express";
import ProductModel from "../model/product.model.js";
import { uploadImage } from "../service/imagekit.service.js";
import type { CreateProductDTO } from "../types/product.dto.js";
import type { IProductImage } from "../types/product.types.js";

//Create Product Controller
const createProduct = async (
  req: Request<{}, {}, CreateProductDTO>,
  res: Response
): Promise<Response> => {
  try {
    const { title, description, price, category, currency } = req.body;

    const seller = req.user._id;

    const files = Array.isArray(req.files) ? req.files : [];

    const images: IProductImage[] = files.length
      ? await Promise.all(
          files.map((file: Express.Multer.File) =>
            uploadImage({ buffer: file.buffer })
          )
        )
      : [];

    const productData: {
      title: string;
      price: number;
      currency: "INR" | "USD";
      seller: typeof seller;
      images: IProductImage[];
      description?: string;
      category?: string;
    } = {
      title,
      price: Number(price),
      currency: currency ?? "INR",
      seller,
      images,
    };

    if (description) productData.description = description;
    if (category) productData.category = category;

    const product = await ProductModel.create(productData);

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { createProduct };
