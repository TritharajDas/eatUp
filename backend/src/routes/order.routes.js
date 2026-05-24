import express from "express";
import { createOrder, verifyPayment } from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Both routes require login (authMiddleware)
router.post("/create", authMiddleware, createOrder);
router.post("/verify", authMiddleware, verifyPayment);

export default router;