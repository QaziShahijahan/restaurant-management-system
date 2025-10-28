// Simple unique order id generator: e.g., ORD-20251022-abc123
export function generateOrderId() {
  const ts = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${ts}-${rand}`;
}
