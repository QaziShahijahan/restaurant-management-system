import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  name: { type: String }, // optional
  seats: { type: Number, default: 2 },
  reserved: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Table", TableSchema);
