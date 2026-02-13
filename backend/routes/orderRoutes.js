import express from "express";
import { createOrder, getMyOrders, getAllOrders, markAsPaid } from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/pay", protect, adminOnly, markAsPaid);

export default router;
