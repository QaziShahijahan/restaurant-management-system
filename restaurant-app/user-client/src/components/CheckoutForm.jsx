// user-client/src/components/CheckoutForm.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";

/**
 * CheckoutForm
 * - Reads and updates cart context (orderType, customer, cooking instructions)
 * - Provides local state for name, phone, address, numberOfPersons
 * - Exposes a onContinue callback (optional) when "Order Now" is pressed
 *
 * Props:
 * - onContinue (function) optional: called with { valid: boolean } when user presses "Order Now"
 */
export default function CheckoutForm({ onContinue }) {
  const { state, setOrderType, setCustomer, setInstructions } = useCart();

  const [name, setName] = useState(state.customer?.name || "");
  const [phone, setPhone] = useState(state.customer?.phone || "");
  const [address, setAddress] = useState(state.customer?.address || "");
  const [persons, setPersons] = useState(2);
  const [localOrderType, setLocalOrderType] = useState(state.orderType || "TAKEAWAY");
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  useEffect(() => {
    // keep context in sync when localOrderType changes
    setOrderType(localOrderType);
  }, [localOrderType, setOrderType]);

  useEffect(() => {
    // ensure context customer reflects form fields
    setCustomer({ name, phone, address });
  }, [name, phone, address, setCustomer]);

  const validate = () => {
    if (!name.trim()) return { ok: false, msg: "Enter name" };
    if (!phone.trim() || phone.trim().length < 7) return { ok: false, msg: "Enter valid phone" };
    if (localOrderType === "TAKEAWAY" && !address.trim()) return { ok: false, msg: "Enter address for takeaway" };
    return { ok: true };
  };

  const handleOrderNow = () => {
    const v = validate();
    if (!v.ok) {
      alert(v.msg);
      if (onContinue) onContinue({ valid: false });
      return;
    }
    // persist customer data to context (already updated via effect)
    if (onContinue) onContinue({ valid: true });
  };

  return (
    <div className="checkout-form-card">
      <div className="cf-header">
        <h4>Enter Your Details</h4>
      </div>

      <div className="cf-controls">
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="cf-input"
        />

        <div className="cf-row">
          <label className="cf-label">Order Type</label>
          <div className="cf-toggle">
            <button
              className={localOrderType === "DINE_IN" ? "active" : ""}
              onClick={() => setLocalOrderType("DINE_IN")}
              type="button"
            >
              Dine In
            </button>
            <button
              className={localOrderType === "TAKEAWAY" ? "active" : ""}
              onClick={() => setLocalOrderType("TAKEAWAY")}
              type="button"
            >
              Take Away
            </button>
          </div>
        </div>

        {localOrderType === "DINE_IN" ? (
          <>
            <input
              type="text"
              placeholder="Number of Person (2,4,6)"
              value={persons}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                setPersons(v ? Number(v) : "");
              }}
              className="cf-input"
            />
            <input
              type="text"
              placeholder="Contact phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="cf-input"
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="cf-input"
            />
            <input
              type="text"
              placeholder="Contact phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="cf-input"
            />
          </>
        )}

        <div className="cf-instructions-row">
          <button
            type="button"
            className="instr-btn-small"
            onClick={() => setInstructionsOpen(true)}
          >
            Add cooking instructions (optional)
          </button>
        </div>

        <div className="cf-actions">
          <button className="order-now-btn" onClick={handleOrderNow} type="button">
            Order Now
          </button>
        </div>
      </div>

      {/* Minimal inline modal trigger — we intentionally keep modal separate.
          If you use the CookingInstructionModal component elsewhere, open it when instructionsOpen is true.
      */}
      {instructionsOpen && (
        <div className="simple-modal-backdrop">
          <div className="simple-modal">
            <textarea
              placeholder="Add cooking instructions..."
              className="cf-textarea"
              onChange={(e) => setInstructions(e.target.value)}
            />
            <div className="cf-modal-actions">
              <button onClick={() => setInstructionsOpen(false)} className="btn-cancel">Cancel</button>
              <button
                onClick={() => {
                  setInstructionsOpen(false);
                }}
                className="btn-next"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
