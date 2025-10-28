import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
  name: String,
  price: Number,
  qty: { type: Number, default: 1 }
});

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  items: [OrderItemSchema],
  total: { type: Number, default: 0 },
  type: { type: String, enum: ["DINE_IN", "TAKEAWAY"], default: "TAKEAWAY" },
  tableNumber: { type: Number }, // for DINE_IN
  customer: {
    name: String,
    phone: String,
    address: String
  },
  cookingInstructions: String,
  status: { type: String, enum: ["PROCESSING", "DONE", "SERVED", "NOT_PICKED_UP"], default: "PROCESSING" },
  assignedChef: { type: mongoose.Schema.Types.ObjectId, ref: "Chef" },
  processingEndsAt: Date // optional: timestamp when processing should be done
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
