import express from "express";
import {
  registerUserValidations,
  loginUserValidations,
  addUserAddressValidations,
} from "../middlewares/validator.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  getUserAddresses,
  addUserAddress,
  deleteUserAddress,
} from "../controllers/auth.controller.js";

const router = express.Router();

//POST /api/auth/register
router.post("/register", registerUserValidations, registerUser);

//POST /api/auth/login
router.post("/login", loginUserValidations, loginUser);

//GET /api/auth/me
router.get("/me", authMiddleware, getCurrentUser);

//GET /api/auth/logout
router.get("/logout", authMiddleware, logoutUser);

//GET /api/auth/users/me/addresses
router.get("/users/me/addresses", authMiddleware, getUserAddresses);

//POST /api/auth/users/me/addresses
router.post(
  "/users/me/addresses",
  authMiddleware,
  addUserAddressValidations,
  addUserAddress
);

//DELETE /api/auth/users/me/addresses/:addressId
router.delete(
  "/users/me/addresses/:addressId",
  authMiddleware,
  deleteUserAddress
);

export default router;
