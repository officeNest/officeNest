import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createBooking } from "../features/bookingSlice";
import Swal from "sweetalert2";
import { Calendar, Users } from "lucide-react";

const Booking = () => {
  const { propertyId } = useParams(); // Get propertyId from URL params
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.bookings) || {
    loading: false,
  };

  // Retrieve and parse user data from localStorage
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).uid : null;

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "Please log in to make a booking.",
      });
      navigate("/login");
      return;
    }

    // Navigate to the payment page with booking details as URL parameters
    navigate(
      `/payment/${propertyId}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&numberOfPeople=${numberOfPeople}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-[#0C2BA1]">
          Confirm Your Booking
        </h2>

        <form onSubmit={handleBooking} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 text-[#0C2BA1]" /> Check-in Date
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 text-[#0C2BA1]" /> Check-out Date
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">
              Number of People
            </label>
            <input
              type="number"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-[#0C2BA1] text-white p-4 rounded-lg flex items-center justify-center gap-2 font-medium"
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
