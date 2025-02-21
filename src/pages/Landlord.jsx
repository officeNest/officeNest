import React, { useState, useEffect } from "react";
import { db, ref, get, set } from "../firebase";
import {
  UserCircle,
  Phone,
  MapPin,
  Building,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const LandlordPage = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    location: "",
    street: "",
    buildingAddress: "",
    propertyImage: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Get user ID from localStorage
  const userId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).uid
    : null;

  useEffect(() => {
    // Redirect if no user is logged in
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const userRef = ref(db, "users/" + userId);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserData((prevData) => ({
            ...prevData,
            ...snapshot.val(),
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      const updatedUserData = { ...userData, role: "owner" };

      const userRef = ref(db, "users/" + userId);
      await set(userRef, updatedUserData);

      // Show SweetAlert after success
      Swal.fire({
        icon: "success",
        title: "successfully updated",
        text: "Your data has been successfully updated to Landlord!",
        confirmButtonText: "OK",
      });

      // Show success notification
      const notification = document.getElementById("notification");
      notification.classList.remove("hidden");
      setTimeout(() => {
        notification.classList.add("hidden");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setIsLoading(false);
  };

  if (!userId) {
    return null;
  }

  return (
    <>
    <div className="min-h-screen  py-12 mt-[5rem] px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Landlord Profile
          </h1>
          <p className="text-gray-600">
            Manage your property information and contact details
          </p>
        </div>

        {/* Success Notification */}
        <div
          id="notification"
          className="hidden fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out"
        >
          Profile updated successfully!
        </div>

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="grid grid-cols-1 gap-6">
            {/* Name Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircle className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2BA1] focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={userData.email}
                disabled
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone Number Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2BA1] focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={userData.location}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2BA1] focus:border-transparent transition-colors duration-200"
                    placeholder="City/Region"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street
                </label>
                <input
                  type="text"
                  name="street"
                  value={userData.street}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2BA1] focus:border-transparent transition-colors duration-200"
                  placeholder="Street name"
                />
              </div>
            </div>

            {/* Building Address */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Building Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="buildingAddress"
                  value={userData.buildingAddress}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2BA1] focus:border-transparent transition-colors duration-200"
                  placeholder="Complete building address"
                />
              </div>
            </div>

            {/* Property Image Link */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Image Link
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="propertyImage"
                  value={userData.propertyImage}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2BA1] focus:border-transparent transition-colors duration-200"
                  placeholder="Enter image URL"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#0C2BA1] text-white py-3 px-6 rounded-lg font-medium
                transform transition-all duration-200 
                hover:bg-[#0C2BA1]/90 hover:scale-[1.02]
                focus:outline-none focus:ring-2 focus:ring-[#0C2BA1] focus:ring-opacity-50
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : null}
              {isLoading ? "Be a LandLord..." : "you Dashboard"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default LandlordPage;
