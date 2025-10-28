// dashboard-client/src/components/Topbar.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { useSearch } from "../context/SearchContext.jsx";
import "../styles/components.css";

export default function Topbar() {
  const { query, setQuery } = useSearch();
  const location = useLocation();

  // Hide the global filter on these routes:
  const HIDE_ON = ["/menu", "/tables"];
  // If your routes have a prefix like /dashboard/menu adjust accordingly (e.g. "/dashboard/menu")
  const hide = HIDE_ON.includes(location.pathname);

  if (hide) {
    // Return empty header (keeps layout consistent). If you prefer the whole topbar removed,
    // you can `return null;` instead.
    return <header className="topbar-large topbar-hidden-placeholder" />;
  }

  return (
    <header className="topbar-large">
      <div className="search-wrap">
        <input
          className="search-large"
          placeholder="Filter..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </header>
  );
}
