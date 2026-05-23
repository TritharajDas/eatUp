import FoodItem from "../models/foodItem.model.js";

export const getAllFoodItems = async (req, res) => {
    try {
        const items = await FoodItem.find().sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createFoodItem = async (req, res) => {
    try {
        const { title, category, calories, price } = req.body;
        const imageURL = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        const item = await FoodItem.create({ title, category, calories, price, imageURL });
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteFoodItem = async (req, res) => {
    try {
        await FoodItem.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};