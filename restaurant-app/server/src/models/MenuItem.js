import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, default: 0 },
  averagePreparationTime: { type: Number, default: 0 }, // minutes
  category: { type: String, default: "Uncategorized" },
  stock: { type: Number, default: 0 },
  imageUrl: String,
  rating: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("MenuItem", MenuItemSchema);
