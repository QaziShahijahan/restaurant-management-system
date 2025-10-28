import React, { useState } from "react";

export default function CookingInstructionModal({ open, onClose, onSave }) {
  const [text, setText] = useState("");

  if (!open) return null;

  const handleNext = () => {
    onSave(text);
    onClose();
    setText("");
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h4>Add Cooking Instructions</h4>
        <textarea placeholder="Add details (e.g., no onions, extra spicy)" value={text} onChange={e => setText(e.target.value)} />
        <p className="modal-note">The restaurant will try its best to follow your request. However, refunds or cancellations in this regard won't be possible.</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-next" onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
}
