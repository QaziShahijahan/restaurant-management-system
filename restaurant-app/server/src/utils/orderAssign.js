// Assign to chef with fewest orders. If tie, pick random among tied chefs.
import Chef from "../models/Chef.js";

/**
 * Finds chef with fewest currentOrders. If tie, picks random.
 * Increments the chef.currentOrders count (atomic update) and returns chef doc.
 */
export async function assignChefToOrder() {
  // Get all chefs
  const chefs = await Chef.find().lean();
  if (!chefs || chefs.length === 0) return null;

  // Find min currentOrders
  const min = Math.min(...chefs.map(c => c.currentOrders || 0));
  const candidates = chefs.filter(c => (c.currentOrders || 0) === min);

  // Choose random candidate
  const choice = candidates[Math.floor(Math.random() * candidates.length)];

  // Atomically increment currentOrders and return updated doc
  const updated = await Chef.findByIdAndUpdate(choice._id, { $inc: { currentOrders: 1 } }, { new: true });
  return updated;
}

export async function releaseChefFromOrder(chefId) {
  if (!chefId) return;
  await Chef.findByIdAndUpdate(chefId, { $inc: { currentOrders: -1 } });
}
