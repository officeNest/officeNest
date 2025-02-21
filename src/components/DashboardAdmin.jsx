import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOffices, softDeleteOffice } from "../features/officesSlice";
import Sidebar from "./Sidebar";
import { FaTrash } from "react-icons/fa"; // Import Trash Icon
import Swal from "sweetalert2"; // Import SweetAlert2
import "sweetalert2/dist/sweetalert2.min.css";

const DashboardAdmin = () => {
  const dispatch = useDispatch();
  const { offices, loading, error } = useSelector((state) => state.offices);
  const [filteredOffices, setFilteredOffices] = useState([]);
  const [filter, setFilter] = useState("all");

  // Fetch offices on component mount
  useEffect(() => {
    dispatch(fetchOffices());
  }, [dispatch]);

  // Filter offices based on the selected filter
  useEffect(() => {
    if (filter === "all") {
      setFilteredOffices(offices);
    } else {
      setFilteredOffices(offices.filter((office) => office.type === filter));
    }
  }, [offices, filter]);

  // Handle delete confirmation
  const handleDelete = (officeId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This property will be marked as deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(softDeleteOffice(officeId));
        Swal.fire("Deleted!", "The property has been deleted.", "success");
      }
    });
  };

  // Loading state
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg font-medium text-gray-600">Loading...</div>
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500 font-medium">{error}</div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-[#0C2BA1] mb-8">
          Dashboard - Properties
        </h1>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          {["all", "Serviced Offices", "Coworking Spaces", "Commercial Spaces"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-md font-semibold transition ${
                filter === type ? "bg-[#0C2BA1] text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setFilter(type)}
            >
              {type === "all" ? "All Properties" : type}
            </button>
          ))}
        </div>

        {/* Display filtered offices */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOffices.map((office) => (
            <div
              key={office.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={office.images?.[0] ?? "/default-image.jpg"}
                  alt={office.name}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                    office.status === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {office.status}
                </div>
              </div>
              <div className="p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{office.name}</h2>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium">Type:</span>
                      <span className="ml-2">{office.type}</span>
                    </div>
                    <p className="text-gray-600">{office.description}</p>
                    <div className="pt-4">
                      <p className="text-lg font-bold text-blue-600">{office.price} JD</p>
                    </div>
                  </div>
                </div>
                {/* Soft delete icon */}
                <FaTrash
                  className="text-red-500 cursor-pointer hover:text-red-700 transition text-lg"
                  onClick={() => handleDelete(office.id)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* No properties found */}
        {filteredOffices.length === 0 && (
          <p className="text-center text-gray-600 mt-6">No properties found.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardAdmin;
