// dashboard-client/src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import MetricCard from "../components/MetricCard.jsx";
import ChartPanel from "../components/ChartPanel.jsx";
import TableCard from "../components/TableCard.jsx";
import api from "../services/api.js";


/**
 * DashboardPage — aggregates orders to compute:
 *  - metrics: chefs, revenue, orders, clients
 *  - pie: distribution of order types/statuses (Takeaway, Served, Dine In)
 *  - line: daily revenue (Mon..Sun) from orders[].createdAt and order.total
 */

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function groupRevenueByWeekday(orders = []) {
  // returns array length 7 with totals by weekday (Mon=0..Sun=6)
  const totals = Array(7).fill(0);
  orders.forEach(o => {
    const ts = o.createdAt ? new Date(o.createdAt) : null;
    if (!ts || Number.isNaN(ts.getTime())) return;
    // JS: getDay 0 = Sunday, map to index: Mon=0 -> map (day + 6) % 7
    const dayIndex = (ts.getDay() + 6) % 7;
    const amount = Number(o.total || 0);
    totals[dayIndex] = totals[dayIndex] + amount;
  });
  return totals;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({ chefs: 0, revenue: 0, orders: 0, clients: 0 });
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [chefs, setChefs] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [ordersRes, tablesRes, chefsRes] = await Promise.all([
          api.get("/orders"),
          api.get("/tables"),
          api.get("/chefs"),
        ]);
        const ordersData = (ordersRes.data && ordersRes.data.data) || [];
        const tablesData = (tablesRes.data && tablesRes.data.data) || [];
        const chefsData = (chefsRes.data && chefsRes.data.data) || [];

        // compute revenue & clients
        const revenue = ordersData.reduce((sum, o) => sum + Number(o.total || 0), 0);
        const uniqueClients = new Set(ordersData.map(o => (o.customer && o.customer.phone) ? o.customer.phone : null).filter(Boolean));
        const clients = uniqueClients.size;

        setOrders(ordersData);
        setTables(tablesData);
        setChefs(chefsData);
        setMetrics({ chefs: chefsData.length, revenue, orders: ordersData.length, clients });
      } catch (err) {
        console.error("Dashboard load error", err);
      }
    }
    load();
  }, []);

  // PIE: counts for Take Away / Served / Dine In
  const takeAwayCount = orders.filter(o => (o.type || "").toUpperCase() === "TAKEAWAY").length;
  const servedCount = orders.filter(o => (o.status || "").toUpperCase() === "SERVED" || (o.status || "").toUpperCase() === "DONE").length;
  const dineInCount = orders.filter(o => (o.type || "").toUpperCase() === "DINE_IN").length;

  const pieData = {
    labels: ["Take Away", "Served", "Dine In"],
    datasets: [
      {
        label: "Order summary",
        data: [takeAwayCount, servedCount, dineInCount],
        backgroundColor: ["#9CA3AF", "#16A34A", "#F59E0B"],
        borderWidth: 0,
      },
    ],
  };

  // LINE: daily revenue for Mon..Sun
  const dailyTotals = groupRevenueByWeekday(orders);
  const lineData = {
    labels: WEEK_DAYS,
    datasets: [
      {
        label: "Revenue",
        data: dailyTotals,
        fill: false,
        tension: 0.32,
        borderColor: "#0b1220",
        backgroundColor: "#0b1220",
        pointBackgroundColor: "#0b1220",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };


  

  return (
    <div className="dashboard-wrapper">
      <h3 className="section-title">Analytics</h3>

      <div className="metrics-row">
        <MetricCard title="TOTAL CHEF" value={String(metrics.chefs).padStart(2, "0")} />
        <MetricCard title="TOTAL REVENUE" value={`₹${metrics.revenue}`} />
        <MetricCard title="TOTAL ORDERS" value={metrics.orders} />
        <MetricCard title="TOTAL CLIENTS" value={metrics.clients} />
      </div>

      <div className="panels-row">
        <section className="panel order-summary-panel">
          <h4>Order Summary</h4>
          <div className="order-summary-top">
            <div className="summary-left">
              <div className="summary-stats-vertical">
                <div className="stat-pill"><div className="stat-num">{String(servedCount).padStart(2, "0")}</div><div className="stat-label">Served</div></div>
                <div className="stat-pill"><div className="stat-num">{String(dineInCount).padStart(2, "0")}</div><div className="stat-label">Dine In</div></div>
                <div className="stat-pill"><div className="stat-num">{String(takeAwayCount).padStart(2, "0")}</div><div className="stat-label">Take Away</div></div>
              </div>
            </div>

            <div className="summary-right">
              <div className="mini-pie-card">
                <ChartPanel type="pie" data={pieData} />
              </div>
            </div>
          </div>
        </section>

        <section className="panel revenue-panel">
          <h4>Revenue</h4>
          <ChartPanel type="line" data={lineData} />
        </section>

        <section className="panel tables-panel">
          <h4>Tables</h4>
          <div className="tables-grid-small">
            {Array.from({ length: Math.max(30, tables.length || 30) }).map((_, idx) => {
              const t = tables.find(x => x.tableNumber === idx + 1);
              const reserved = t ? t.reserved : false;
              return (
                <div key={idx} className={`mini-table ${reserved ? "mini-reserved" : ""}`}>
                  <div className="mini-number">{(idx + 1).toString().padStart(2, "0")}</div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="chef-table-panel panel">
        <h4>Chef Order Counts</h4>
        <table className="chef-table">
          <thead>
            <tr><th>Chef Name</th><th>Order Taken</th></tr>
          </thead>
          <tbody>
            {chefs.map(c => (
              <tr key={c._id}><td>{c.name}</td><td>{(c.currentOrders || 0).toString().padStart(2, "0")}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
