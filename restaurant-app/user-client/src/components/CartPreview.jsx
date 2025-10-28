import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function CartPreview() {
  const { state, removeItem, updateQty, subtotal } = useCart();
  const nav = useNavigate();

  if (!state.items.length) return null;

  return (
    <div className="cart-preview">
      <div className="cart-header">
        <div>Cart • {state.items.length} item(s)</div>
        <div>₹{subtotal}</div>
      </div>
      <div className="cart-items">
        {state.items.map(it => (
          <div key={it.menuItem} className="cart-item">
            <div className="ci-left">
              <div className="ci-name">{it.name}</div>
              <div className="ci-price">₹{it.price}</div>
            </div>
            <div className="ci-right">
              <button onClick={() => updateQty(it.menuItem, Math.max(0, it.qty - 1))}>-</button>
              <span>{it.qty}</span>
              <button onClick={() => updateQty(it.menuItem, it.qty + 1)}>+</button>
              <button className="ci-remove" onClick={() => removeItem(it.menuItem)}>x</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-actions">
        <button className="next-btn" onClick={() => nav("/checkout")}>Next</button>
      </div>
    </div>
  );
}
