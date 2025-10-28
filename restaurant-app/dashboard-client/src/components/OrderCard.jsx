// dashboard-client/src/components/OrderCard.jsx
import React from "react";
import "../styles/components.css";

/**
 * OrderCard
 * props:
 *  - order: full order object from backend
 *  - onChangeStatus(orderId, newStatus): callback to request status change (provided by page)
 */
export default function OrderCard({ order, onChangeStatus }) {
  const status = (order.status || "PROCESSING").toUpperCase();
  const type = (order.type || "TAKEAWAY").toUpperCase();

  // pick visual class based on status
  const statusClass =
    status === "SERVED" || status === "DONE"
      ? "oc-done"
      : status === "PROCESSING"
      ? "oc-processing"
      : "oc-ghost";

  // pick badge text for type
  const typeLabel = type === "DINE_IN" ? "Dine In" : "Take Away";

  const placed = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString()
    : "";

  return (
    <div className={`order-card ${statusClass}`}>
      <div className="order-card-top">
        <div className="order-id-wrap">
          <div className="order-emoji">🍴</div>
          <div className="order-id">
            #{(order.orderId || "").split("-").slice(-1)[0]}
          </div>
        </div>

        <div className="order-badges">
          <div
            className={`badge badge-type ${
              type === "DINE_IN" ? "badge-dine" : "badge-take"
            }`}
          >
            {typeLabel}
          </div>
          <div className={`badge badge-status`}>
            {status === "PROCESSING"
              ? "Processing"
              : status === "DONE"
              ? "Done"
              : status}
          </div>
        </div>
      </div>

      <div className="order-meta">
        <div>
          {/* Table: <strong>{order.tableNumber}</strong> */}
        </div>
        <div>
          Items: <strong>{(order.items || []).length}</strong>
        </div>
        <div>
          Placed: <strong>{placed}</strong>
        </div>
      </div>

      <div className="order-items">
        {(order.items || []).map((it, idx) => (
          <div className="oi-row" key={idx}>
            <div className="oi-qty">{it.qty}x</div>
            <div className="oi-name">{it.name}</div>
            <div className="oi-price">₹{it.price * it.qty}</div>
          </div>
        ))}
      </div>

      <div className="order-footer">
        <div className="order-total">₹{order.total ?? 0}</div>

        {/* Only show "Order Done" when processing or not served yet */}
        {status !== "SERVED" && (
          <button
            className="order-action-btn"
            onClick={() => {
              const nextStatus = status === "PROCESSING" ? "DONE" : "SERVED";
              onChangeStatus && onChangeStatus(order._id, nextStatus);
            }}
          >
            {status === "PROCESSING" ? "Order Done" : "Mark Served"}
          </button>
        )}
      </div>
    </div>
  );
}
