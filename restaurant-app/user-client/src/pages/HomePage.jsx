import React, { useEffect, useState } from "react";
import CategoryStrip from "../components/CategoryStrip.jsx";
import ItemCard from "../components/ItemCard.jsx";
import CartPreview from "../components/CartPreview.jsx";
import api from "../services/api.js";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // default to pizza category
    navigate("/category/pizza", { replace: true });
  }, [navigate]);

  return (
    <div className="mobile-shell">
      <header className="mobile-header">
        <h3>Good evening</h3>
        <p>Place your order here</p>
      </header>
      <CategoryStrip />
      <div className="home-content">
        <CartPreview />
      </div>
    </div>
  );
}
