import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            title: String,
            price: Number,
            qty: Number,
            imageURL: String,
        }
    ],
    totalAmount: { type: Number, required: true },
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, default: null },
    status: { type: String, default: "pending" },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);