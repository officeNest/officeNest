import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../features/usersslice";
import Sidebar from "./Sidebar";

export default function UsersAdmin() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((user) => user.role.toLowerCase() === filter)
      );
    }
  }, [users, filter]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "owner":
        return "text-[#0C2BA1]";
      case "visitor":
        return "text-green-500";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex">
      <Sidebar/>
      <div className="p-6 w-300">
        <h1 className="text-3xl font-semibold mb-6 text-[#0C2BA1]">
          All Users
        </h1>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md font-semibold transition ${
              filter === "all"
                ? "bg-[#0C2BA1] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setFilter("all")}
          >
            All Users
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold transition ${
              filter === "owner"
                ? "bg-[#0C2BA1] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setFilter("owner")}
          >
            Owners
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold transition ${
              filter === "visitor"
                ? "bg-[#0C2BA1] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setFilter("visitor")}
          >
            Visitors
          </button>
        </div>

        {loading && <p className="text-lg text-[#0C2BA1]">Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.uid}
              className="p-6 bg-white rounded-lg shadow-md border border-[#0C2BA1]/10 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-bold text-[#0C2BA1] mb-2">
                {user.name}
              </h2>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <p
                className={`text-sm font-semibold ${getStatusColor(
                  user.role
                )} mb-1`}
              >
                {user.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
