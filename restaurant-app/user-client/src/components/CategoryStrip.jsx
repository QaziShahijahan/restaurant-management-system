import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { key: "burger", label: "Burger", icon: "🍔" },
  { key: "pizza", label: "Pizza", icon: "🍕" },
  { key: "drink", label: "Drink", icon: "🥤" },
  { key: "fries", label: "French fries", icon: "🍟" },
  { key: "veggies", label: "Veggies", icon: "🥗" }
];

export default function CategoryStrip({ selected = "pizza" }) {
  const nav = useNavigate();
  return (
    <div className="category-strip">
      {categories.map(c => (
        <button key={c.key} className={`cat-btn ${selected === c.key ? "active" : ""}`} onClick={() => nav(`/category/${c.key}`)}>
          <div className="cat-icon">{c.icon}</div>
          <div className="cat-label">{c.label}</div>
        </button>
      ))}
    </div>
  );
}
