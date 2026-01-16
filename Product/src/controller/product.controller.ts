import mongoose from "mongoose";
import type { Request, Response } from "express";
import ProductModel from "../model/product.model.js";
import { uploadImage } from "../service/imagekit.service.js";
import type {
  CreateProductDTO,
  GetProductParams,
  GetProductsQuery,
  UpdateProductDTO
} from "../types/product.dto.js";
import type { IProductImage } from "../types/product.types.js";


//Create Product Controller
const createProduct = async (
  req: Request<{}, {}, CreateProductDTO>,
  res: Response
): Promise<Response> => {
  try {
    const { title, description, price, category, currency } = req.body;
    console.log(price);
    

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

//GET PRODUCTS WITH FILTERS
const getProducts = async (
  req: Request<{}, {}, {}, GetProductsQuery>,
  res: Response
): Promise<Response> => {
  try {
    const { q, minprice, maxprice, skip = "0", limit = "20" } = req.query;

    const filter = {} as any;
    if (q) {
      filter.$text = { $search: q };
    }
    if (minprice || maxprice) {
      filter.price = {};

      if (minprice) {
        filter.price.$gte = Number(minprice);
      }

      if (maxprice) {
        filter.price.$lte = Number(maxprice);
      }
    }

    const products = await ProductModel.find(filter)
      .skip(Number(skip))
      .limit(Math.min(Number(limit), 20))
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

//GET PRODUCT BY ID
const getProductById = async (
  req: Request<GetProductParams>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    console.log(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//UPDATE PRODUCT
const updateProduct = async (
  req: Request<{ id?: string }, {}, UpdateProductDTO>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
       return res.status(400).json({ message: "Invalid product ID format" });
      }


    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (
      product.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "seller"
    ) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const allowedUpdates: (keyof UpdateProductDTO)[] = [
      "title",
      "description",
      "price",
      "category",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        product.set(field, req.body[field]);
      }
    });

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

//DELETE PRODUCT
const deleteProduct = async(req:Request<{ id?: string }>, res:Response):Promise<Response> => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }
  const product = await ProductModel.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  if (product.seller.toString() !== req.user._id && req.user.role !== "seller") {
    return res.status(403).json({ message: "Forbidden" });
  }
  await ProductModel.findByIdAndDelete(id);
  return res.status(200).json({ message: "Product deleted" });
}

//GET PRODUCT BY SELLER
const getProductsBySeller = async(req:Request, res:Response):Promise<Response> => {
  const sellerId = req.user._id;
  const { skip = 0, limit = 20 } = req.query;
  const products = await ProductModel.find({ seller: sellerId })
    .skip(Number(skip))
    .limit(Math.min(Number(limit), 20))
    .sort({ createdAt: -1 });
  return res.status(200).json({ data: products });
}

export { createProduct, getProductById, getProducts, updateProduct,deleteProduct,getProductsBySeller };
