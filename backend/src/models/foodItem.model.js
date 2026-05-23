import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    calories: { type: String, required: true },
    price: { type: String, required: true },
    imageURL: { type: String, required: true },
    qty: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.model("FoodItem", foodItemSchema);