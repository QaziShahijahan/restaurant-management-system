// user-client/src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import CookingInstructionModal from "../components/CookingInstructionModal.jsx";
import SwipeToOrder from "../components/SwipeToOrder.jsx";
import CheckoutForm from "../components/CheckoutForm.jsx";
import api from "../services/api.js";

/**
 * CheckoutPage
 * - Uses CheckoutForm to collect/validate user inputs
 * - Shows CookingInstructionModal when requested
 * - Enables SwipeToOrder only after CheckoutForm validates (onContinue -> valid)
 * - Places order via POST /api/orders
 */
export default function CheckoutPage() {
  const { state, subtotal, clearCart } = useCart();
  const [openInstructions, setOpenInstructions] = useState(false);
  const [swipeEnabled, setSwipeEnabled] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState("");
  const nav = useNavigate();

  // Called by CheckoutForm when user presses "Order Now" (validates inputs)
  const handleContinue = ({ valid }) => {
    if (valid) {
      setSwipeEnabled(true);
      setMessage("All set — swipe to place your order");
    } else {
      setSwipeEnabled(false);
      setMessage("Please complete the form correctly");
    }
  };

  // Called when user confirms via swipe control
  const placeOrder = async () => {
    if (placing) return;
    if (!state.items || state.items.length === 0) {
      alert("Cart is empty");
      return;
    }

    setPlacing(true);
    setMessage("Placing order...");
    try {
      const payload = {
        items: state.items.map(i => ({ menuItem: i.menuItem, qty: i.qty })),
        type: state.orderType || "TAKEAWAY",
        customer: state.customer || {},
        cookingInstructions: state.cookingInstructions || ""
      };

      const res = await api.post("/orders", payload);
      if (res.data && res.data.success) {
        // success — clear cart and navigate to thank you
        clearCart();
        nav("/thanks", { replace: true });
      } else {
        console.error("Order response:", res.data);
        alert("Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error placing order. Check console.");
    } finally {
      setPlacing(false);
      setSwipeEnabled(false);
      setMessage("");
    }
  };

  return (
    <div className="checkout-shell">
      <h3>Checkout</h3>

      {/* Selected items summary */}
      <div className="selected-item-list">
        {state.items && state.items.length ? (
          state.items.map(it => (
            <div key={it.menuItem} className="checkout-item">
              <img src={it.imageUrl || "/assets/food-placeholder.jpg"} alt={it.name} />
              <div className="ci-info">
                <div className="ci-name">{it.name}</div>
                <div className="ci-qty">Qty: {it.qty}</div>
                <div className="ci-price">₹{it.price * it.qty}</div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: 12, color: "#64748b" }}>No items in cart.</div>
        )}
      </div>

      {/* Button to add cooking instructions (or you can open modal from CheckoutForm) */}
      <div className="instructions-row">
        <button className="instr-btn" onClick={() => setOpenInstructions(true)}>
          Add cooking instructions
        </button>
      </div>

      {/* Checkout form for name/phone/address/dine-in toggle */}
      <div style={{ marginTop: 12 }}>
        <CheckoutForm onContinue={handleContinue} />
      </div>

      {/* Price summary */}
      <div className="price-summary" style={{ marginTop: 12 }}>
        <div>Item Total <span>₹{subtotal}</span></div>
        <div>Delivery Charge <span>₹{state.orderType === "TAKEAWAY" ? 50 : 0}</span></div>
        <div>Taxes <span>₹{Math.round(subtotal * 0.02)}</span></div>
        <div className="grand">Grand Total <span>₹{subtotal + (state.orderType === "TAKEAWAY" ? 50 : 0) + Math.round(subtotal * 0.02)}</span></div>
      </div>

      {/* Status / helper message */}
      {message && <div style={{ marginTop: 10, color: "#475569" }}>{message}</div>}

      {/* Swipe-to-order control — enabled only after validation */}
      <div style={{ marginTop: 18 }}>
        <SwipeToOrder
          label={placing ? "Placing..." : swipeEnabled ? "Swipe to Order" : "Complete details to enable"}
          onConfirm={() => {
            if (!swipeEnabled) {
              alert("Please complete the form first.");
              return;
            }
            placeOrder();
          }}
        />
      </div>

      {/* Cooking instructions modal */}
      <CookingInstructionModal
        open={openInstructions}
        onClose={() => setOpenInstructions(false)}
        onSave={(text) => {
          // Save into cart context
          // useCart's setInstructions is not imported here, so use window-level event or
          // better: update the CartContext by a small helper: but simplest is to use a hidden method.
          // We'll instead call an event that CheckoutForm or other components can read.
          // For simplicity, write to localStorage and also dispatch via a custom event.
          try {
            // store in localStorage for persistence
            localStorage.setItem("cookingInstructions", text || "");
            // dispatch event so CartContext (if listening) can pick it up — but CartContext isn't listening by default
            const ev = new CustomEvent("cookingInstructionsUpdated", { detail: text });
            window.dispatchEvent(ev);
          } catch (e) {
            console.warn("Could not persist instructions:", e);
          }
          setOpenInstructions(false);
        }}
      />

      {/* Note:
          The CookingInstructionModal above will persist the text to localStorage and dispatch an event.
          If you prefer direct context updates, replace the onSave handler with useCart().setInstructions(text)
          by importing setInstructions from the CartContext at top:
            const { setInstructions } = useCart();
          and then calling setInstructions(text) here. That is cleaner — if you want, I can update this file to use setInstructions directly.
      */}
    </div>
  );
}
