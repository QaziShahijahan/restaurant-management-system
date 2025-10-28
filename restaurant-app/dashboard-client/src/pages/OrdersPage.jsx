// dashboard-client/src/pages/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard.jsx";
import api from "../services/api.js";
import { useSearch } from "../context/SearchContext.jsx";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { query } = useSearch();
  // eslint-disable-next-line no-unused-vars
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("load orders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const refreshInterval = setInterval(load, 15000); // refresh every 15s for live kitchen view
    return () => clearInterval(refreshInterval);
  }, []);

  const handleChangeStatus = async (id, newStatus) => {
    // set busy to disable double clicks
    setBusyId(id);
    try {
      // PATCH endpoint — backend should accept partial update
      await api.patch(`/orders/${id}`, { status: newStatus });
      // optimistic UI: update locally instead of reloading everything
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("status update failed", err);
      alert("Failed to update order status. Check console.");
    } finally {
      setBusyId(null);
    }
  };

  // filter with global query
  const q = (query || "").trim().toLowerCase();
  const visible = q ? orders.filter(o => {
    const fields = [
      o.orderId,
      o.status,
      o.type,
      o.customer?.name,
      o.customer?.phone,
      String(o.tableNumber),
      ...(o.items || []).map(it => it.name)
    ];
    return fields.some(f => f && String(f).toLowerCase().includes(q));
  }) : orders;

  return (
    <div className="orders-page">
      <h2>Orders Summary</h2>

      <div className="orders-panel">
        {loading ? <div className="loader">Loading orders...</div> : null}
        {visible.length === 0 && !loading ? (
          <div className="empty">No orders found</div>
        ) : (
          <div className="orders-grid">
            {visible.map(o => (
              <OrderCard key={o._id} order={o} onChangeStatus={(id, s) => handleChangeStatus(id, s)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
