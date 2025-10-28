// dashboard-client/src/pages/TablesPage.jsx
import React, { useEffect, useState } from "react";
import TableCard from "../components/TableCard.jsx";
import api from "../services/api.js";

/**
 * TablesPage
 * - Loads list of tables from API
 * - Renders a grid of TableCard components that match Figma style
 * - Shows an "Add table" dashed card that opens a small create form
 * - Delete table action calls API and refreshes list (server renumbers)
 */
export default function TablesPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createSeats, setCreateSeats] = useState(2);
  const [createName, setCreateName] = useState("");

  const loadTables = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tables");
      setTables(res.data.data || []);
    } catch (err) {
      console.error("Load tables error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this table? This will renumber tables.")) return;
    try {
      await api.delete(`/tables/${id}`);
      await loadTables();
    } catch (err) {
      console.error("Delete table error", err);
      alert("Could not delete table");
    }
  };

  const handleCreate = async () => {
    try {
      const payload = {
        seats: Number(createSeats || 2),
        name: createName || ""
      };
      await api.post("/tables", payload);
      setShowCreate(false);
      setCreateName("");
      setCreateSeats(2);
      await loadTables();
    } catch (err) {
      console.error("Create error", err);
      alert("Failed to create table");
    }
  };

  return (
    <div className="tables-page">
      <h2>Tables</h2>

      <div className="tables-panel">
        <div className="tables-grid">
          {/* Render table cards */}
          {tables.map((t) => (
            <TableCard key={t._id} table={t} onDelete={handleDelete} />
          ))}

          {/* Add tile */}
          <div className="table-card-add" onClick={() => setShowCreate(true)} role="button" tabIndex={0}>
            <div className="add-plus">+</div>
          </div>
        </div>
      </div>

      {/* Floating create modal (small card) */}
      {showCreate && (
        <div className="create-modal-backdrop" onClick={() => setShowCreate(false)}>
          <div className="create-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cm-title">Table name (optional)</div>
            <input
              className="cm-input"
              placeholder="Table name"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
            />
            <div className="cm-row">
              <label>Persons</label>
              <select value={String(createSeats)} onChange={(e) => setCreateSeats(Number(e.target.value))}>
                <option value="2">02</option>
                <option value="4">04</option>
                <option value="6">06</option>
              </select>
            </div>

            <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
              <button className="cm-btn cm-cancel" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="cm-btn cm-create" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}

      {loading && <div className="loader">Loading tables...</div>}
    </div>
  );
}
