import express from "express";
import {
  createOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import Order from "../models/Order.js";

const router = express.Router();

router.post(
  "/",
  validateRequest({
    items: (v) => Array.isArray(v) && v.length > 0,
    type: (v) => ["DINE_IN", "TAKEAWAY"].includes(v),
    customer: "required",
  }),
  createOrder
);
router.get("/", listOrders);
router.get("/:id", getOrder);
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const order = await Order.findByIdAndUpdate(id, updates, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    return res.json({ success: true, data: order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});
export default router;
