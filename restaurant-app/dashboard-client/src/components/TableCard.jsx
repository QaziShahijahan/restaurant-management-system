// dashboard-client/src/components/TableCard.jsx
import React from "react";

export default function TableCard({ table, onDelete }) {
  const reserved = table?.reserved;
  const seats = table?.seats ?? 0;

  return (
    <div className={`table-card-grid ${reserved ? "reserved" : ""}`}>
      <button className="table-delete" title="Delete table" onClick={() => onDelete && onDelete(table._id)}>
        🗑
      </button>

      <div className="table-content">
        <div className="table-label">Table</div>
        <div className="table-number">{String(table.tableNumber).padStart(2, "0")}</div>
      </div>

      <div className="table-meta">
        <div className="chair-icon">🪑</div>
        <div className="chair-count">{String(seats).padStart(2, "0")}</div>
      </div>
    </div>
  );
}
