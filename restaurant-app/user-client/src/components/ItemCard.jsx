import React from "react";
import { useCart } from "../context/CartContext.jsx";

export default function ItemCard({ item }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      menuItem: item._id,
      name: item.name,
      price: item.price,
      qty: 1
    });
  };

  return (
    <div className="item-card">
      <div className="item-img">
        <img src={item.imageUrl || "/assets/food-placeholder.jpg"} alt={item.name} />
      </div>
      <div className="item-meta">
        <div className="item-name">{item.name}</div>
        <div className="item-price">₹{item.price}</div>
      </div>
      <button className="add-btn" onClick={handleAdd}>+</button>
    </div>
  );
}
