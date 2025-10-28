// dashboard-client/src/pages/MenuPage.jsx
import React, { useEffect, useState } from "react";
import MenuItemCard from "../components/MenuItemCard.jsx";
import api from "../services/api.js";

const categories = ["all", "pizza", "burger", "fries", "drink", "veggies"];

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category && category !== "all") params.category = category;
      if (query) params.search = query;
      const res = await api.get("/menu", { params });
      setItems(res.data.data || []);
    } catch (err) {
      console.error("Failed to load menu", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // simple client-side search (also hits backend if you change to use 'search' query)
  const visible = items.filter(i =>
    !query ? true : (i.name || "").toLowerCase().includes(query.toLowerCase()) || (i.description || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h2>Menu Management</h2>

        <div className="menu-controls">
          <input
            className="menu-search"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") load(); }}
          />
        </div>
      </div>

      <div className="menu-categories">
        {categories.map(cat => (
          <button
            key={cat}
            className={`cat-pill ${category === cat ? "active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat === "all" ? "All" : cat[0].toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="menu-panel">
        {loading ? (
          <div className="loader">Loading menu...</div>
        ) : visible.length === 0 ? (
          <div className="empty">No items found</div>
        ) : (
          <div className="menu-grid">
            {visible.map(item => <MenuItemCard key={item._id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  );
}
