import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/components.css";

function Sidebar() {
  return (
    <aside className="sidebar-rail">
      <nav className="rail-nav">
        <NavLink to="/dashboard" className="rail-icon" title="Dashboard">🏠</NavLink>
        <NavLink to="/tables" className="rail-icon" title="Tables">🪑</NavLink>
        <NavLink to="/menu" className="rail-icon" title="Menu">📋</NavLink>
        <NavLink to="/orders" className="rail-icon" title="Orders">📊</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
