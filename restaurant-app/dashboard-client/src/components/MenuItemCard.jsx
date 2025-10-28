import React from "react";


export default function MenuItemCard({ item }) {
  const img = item.imageUrl || "/assets/food-placeholder.jpg";

  return (
    <div className="menu-card">
      <div className="menu-card-image">
        <img src={img} alt={item.name} />
      </div>

      <div className="menu-card-body">
        <div className="menu-card-title">{item.name}</div>
        {item.description && <div className="menu-card-desc">{item.description}</div>}

        <div className="menu-card-meta">
          <div className="meta-left">
            <div className="meta-row"><strong>Price:</strong> ₹{item.price}</div>
            <div className="meta-row"><strong>Prep:</strong> {item.averagePreparationTime || 0} mins</div>
          </div>

          <div className="meta-right">
            <div className="meta-row">{item.category}</div>
            <div className="meta-row">{item.stock > 0 ? "In stock" : "Out of stock"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
