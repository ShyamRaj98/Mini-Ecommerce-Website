import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  deleteProduct,
  getAllProductsAdmin,
  updateProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* =========================================
   🔐 ADMIN ROUTES
========================================= */

// Add Product
router.post("/", protect, adminOnly, upload.single("image"), addProduct);

// Get All Products (Admin)
router.get("/admin/products", protect, adminOnly, getAllProductsAdmin);

// Update Product
router.put(
  "/admin/products/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateProduct,
);

// Delete Product
router.delete("/admin/products/:id", protect, adminOnly, deleteProduct);

/* =========================================
   🌍 PUBLIC ROUTES
========================================= */

// Get All Products
router.get("/", getProducts);

// Get Single Product (KEEP THIS LAST)
router.get("/:id", getProductById);

export default router;
