import mongoose from "mongoose";

const ChefSchema = new mongoose.Schema({
  name: { type: String, required: true },
  currentOrders: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Chef", ChefSchema);
