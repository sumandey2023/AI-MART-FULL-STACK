import type { Request, Response } from "express";
import { ENV } from "../config/env.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import type { RegisterUserBody } from "../types/auth.dto.js";
import type { LoginUserBody } from "../types/auth.dto.js";
import type { AddressBody } from "../types/auth.dto.js";

//Register Controller
const registerUser = async (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response
): Promise<Response> => {
  try {
    const {
      username,
      email,
      password,
      fullName: { firstName, lastName },
      role,
    } = req.body;

    const isUserExist = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (isUserExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      fullName: { firstName, lastName },
      role: role ?? "user",
    });

    const token = jwt.sign(
      {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
      ENV.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: "User registered successfully",
        user,
        token,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Login Controller
const loginUser = async (
  req: Request<{}, {}, LoginUserBody>,
  res: Response
): Promise<Response> => {
  try {
    const { email, username, password } = req.body;

    const orQuery: Array<{ email?: string; username?: string }> = [];

    if (email) orQuery.push({ email });
    if (username) orQuery.push({ username });

    if (orQuery.length === 0) {
      return res.status(400).json({
        message: "Email or username is required",
      });
    }

    const user = await userModel.findOne({ $or: orQuery }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password ?? "");

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
      ENV.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "User logged in successfully",
        user,
        token,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return res.status(200).json({
    message: "User fetched successfully",
    user: req.user,
  });
};

const logoutUser = async (req: Request, res: Response): Promise<Response> => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ message: "User is not logged in" });
  }
  res.clearCookie("token");
  return res.status(200).json({ message: "User logged out successfully" });
};

const getUserAddresses = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId).select("addresses");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "User addresses fetched successfully",
      addresses: user?.addresses || [],
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addUserAddress = async (
  req: Request<{}, {}, AddressBody>,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user._id;
    const { street, city, state, zip, country, isDefault } = req.body;

    const user = await userModel.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          addresses: { street, city, state, zip, country, isDefault },
        },
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUserAddress = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user._id;
    const addressId = req.params.addressId;

    const isAddressExist = await userModel.findOne({
      _id: userId,
      "addresses._id": addressId,
    });

    if (!isAddressExist) {
      return res.status(404).json({ message: "Address not found" });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  getUserAddresses,
  addUserAddress,
  deleteUserAddress,
};
