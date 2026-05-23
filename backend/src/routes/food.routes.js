import express from "express";
import multer from "multer";
import path from "path";
import { getAllFoodItems, createFoodItem, deleteFoodItem } from "../controllers/foodController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

const router = express.Router();

router.get("/", getAllFoodItems);
router.post("/", authMiddleware, upload.single("image"), createFoodItem);
router.delete("/:id", authMiddleware, deleteFoodItem);

export default router;