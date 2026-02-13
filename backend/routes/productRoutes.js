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


//  ADMIN ROUTES
router.post("/", protect, adminOnly, upload.single("image"), addProduct);
router.get("/admin/products", protect, adminOnly, getAllProductsAdmin);
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
