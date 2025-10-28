import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import TablesPage from "./pages/TablesPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import "./styles/dashboard.css";
import "./styles/components.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tables" element={<TablesPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/orders" element={<OrdersPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
