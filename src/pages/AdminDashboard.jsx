import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardAdmin from "../components/DashboardAdmin";
import RequestsAdmin from "../components/RequestsAdmin";
import UsersAdmin from "../components/UsersAdmin";

export default function AdminDashboard() {
  return (
    <div className="flex">
      {/* Sidebar always visible /}
      <Sidebar />

      {/ Main Content - Display pages based on the route */}
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<DashboardAdmin />} />
          <Route path="/requests" element={<RequestsAdmin />} />
          <Route path="/users" element={<UsersAdmin />} />
        </Routes>
      </div>
    </div>
  );
}
