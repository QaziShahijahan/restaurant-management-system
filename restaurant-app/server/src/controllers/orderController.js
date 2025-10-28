import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import { generateOrderId } from "../utils/idGenerator.js";
import { assignChefToOrder, releaseChefFromOrder } from "../utils/orderAssign.js";

/**
 * Create Order:
 * - Build items array from payload (must include menuItem ids and qty)
 * - Calculate total
 * - Assign chef using orderAssign util
 */
export const createOrder = async (req, res, next) => {
  try {
    const { items = [], type = "TAKEAWAY", customer = {}, tableNumber, cookingInstructions } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must have items" });
    }

    // Build items with price and name snapshot
    const builtItems = [];
    let total = 0;
    for (const it of items) {
      const menu = await MenuItem.findById(it.menuItem);
      if (!menu) continue;
      const qty = it.qty || 1;
      builtItems.push({
        menuItem: menu._id,
        name: menu.name,
        price: menu.price,
        qty
      });
      total += menu.price * qty;
    }

    const orderId = generateOrderId();
    // Assign chef
    const chef = await assignChefToOrder();

    const orderDoc = await Order.create({
      orderId,
      items: builtItems,
      total,
      type: type === "DINE_IN" ? "DINE_IN" : "TAKEAWAY",
      tableNumber,
      customer,
      cookingInstructions,
      assignedChef: chef ? chef._id : undefined,
      status: "PROCESSING"
    });

    res.status(201).json({ success: true, data: orderDoc });
  } catch (err) {
    next(err);
  }
};

export const listOrders = async (req, res, next) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    const orders = await Order.find(filter).populate("assignedChef").sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("assignedChef").lean();
    if (!order) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Not found" });

    const prevStatus = order.status;
    order.status = status;
    await order.save();

    // If order completed, decrement chef counter
    if ((prevStatus === "PROCESSING" || prevStatus === "NOT_PICKED_UP") && (status === "DONE" || status === "SERVED" || status === "NOT_PICKED_UP")) {
      if (order.assignedChef) {
        await releaseChefFromOrder(order.assignedChef);
      }
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};
