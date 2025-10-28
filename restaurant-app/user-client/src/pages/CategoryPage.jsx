import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CategoryStrip from "../components/CategoryStrip.jsx";
import ItemCard from "../components/ItemCard.jsx";
import CartPreview from "../components/CartPreview.jsx";
import api from "../services/api.js";

export default function CategoryPage() {
  const { slug } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        // call backend API: /menu?category=slug
        const res = await api.get("/menu", { params: { category: slug } });
        setItems(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [slug]);

  return (
    <div className="mobile-shell">
      <header className="mobile-header">
        <h3>Good evening</h3>
        <p>Place your order here</p>
      </header>
      <CategoryStrip selected={slug} />
      <div className="category-title">{slug ? slug[0].toUpperCase() + slug.slice(1) : "Menu"}</div>

      <div className="items-grid">
        {items.map(i => <ItemCard key={i._id} item={i} />)}
      </div>

      <CartPreview />
    </div>
  );
}
