import dotenv from "dotenv";
dotenv.config();
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.model.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
    try {
        const { totalAmount, items } = req.body;

        // Create order in Razorpay
        // Amount must be in paise (1 rupee = 100 paise)
        const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        // Save pending order to MongoDB
        const order = await Order.create({
            user: req.user.id,
            items,
            totalAmount,
            razorpay_order_id: razorpayOrder.id,
            status: "pending",
        });

        res.status(201).json({
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            dbOrderId: order._id,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Razorpay sends a signature — we verify it using our secret key
        // This proves the payment actually came from Razorpay, not a fake request
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        // Payment is real — update order status in MongoDB
        await Order.findOneAndUpdate(
            { razorpay_order_id },
            { razorpay_payment_id, status: "paid" }
        );

        res.status(200).json({ message: "Payment verified successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};