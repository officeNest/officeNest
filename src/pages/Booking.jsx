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
  const [isModalOpen, setIsModalOpen] = useState(false); // State for T&C modal
  const [isTermsAccepted, setIsTermsAccepted] = useState(false); // State for T&C checkbox

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

    if (!isTermsAccepted) {
      Swal.fire({
        icon: "error",
        title: "Terms and Conditions",
        text: "You must accept the terms and conditions to proceed.",
      });
      return;
    }

    // Navigate to the payment page with booking details as URL parameters
    navigate(
      `/payment/${propertyId}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&numberOfPeople=${numberOfPeople}`
    );
  };

  // Open T&C modal
  const openModal = () => setIsModalOpen(true);

  // Close T&C modal
  const closeModal = () => setIsModalOpen(false);

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

          {/* Terms and Conditions Checkbox */}
          <div className="mt-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isTermsAccepted}
                onChange={(e) => setIsTermsAccepted(e.target.checked)}
                className="w-4 h-4"
              />
              <span>
                I agree to the{" "}
                <button
                  type="button"
                  onClick={openModal}
                  className="text-[#0C2BA1] hover:underline"
                >
                  Terms and Conditions
                </button>
              </span>
            </label>
          </div>

          {/* Confirm Booking Button */}
          <button
            type="submit"
            disabled={loading || !isTermsAccepted} // Disable if terms are not accepted
            className="mt-6 w-full bg-[#0C2BA1] text-white p-4 rounded-lg flex items-center justify-center gap-2 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </form>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Booking;

// Terms and Conditions Modal
const TermsAndConditionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
        <h2 className="text-3xl font-bold text-[#0C2BA1] mb-6">
          Terms and Conditions for Renting Office Space
        </h2>

        {/* Scrollable Content */}
        <div className="max-h-[60vh] overflow-y-auto space-y-4 mt-6">
          <h3 className="text-2xl font-semibold text-[#0C2BA1]">
            1. General Terms
          </h3>
          <p>
            1.1. The office space rental agreement is between you (the "Renter")
            and [Your Company Name] ("We," "Us," or "Our").
          </p>
          <p>1.2. You must be at least 18 years old to make a booking.</p>
          <p>
            1.3. All bookings are subject to availability and confirmation by
            us.
          </p>

          <h3 className="text-2xl font-semibold text-[#0C2BA1]">
            2. Rental Period
          </h3>
          <p>
            2.1. The rental period is defined by the check-in and check-out
            dates selected during the booking process.
          </p>
          <p>
            2.2. Any extension or modification of the rental period must be
            requested at least 48 hours before the check-out date and is subject
            to availability.
          </p>

          <h3 className="text-2xl font-semibold text-[#0C2BA1]">
            3. Payments and Cancellations
          </h3>
          <p>
            3.1. Full payment is required at the time of booking. Payment can be
            made using the methods available on our platform.
          </p>
          <p>
            3.2. A booking may be canceled free of charge up to 24 hours before
            the check-in date. Cancellations made after this period may incur a
            cancellation fee.
          </p>

          <h3 className="text-2xl font-semibold text-[#0C2BA1]">
            4. Responsibilities of the Renter
          </h3>
          <p>
            4.1. The Renter is responsible for maintaining the office space in a
            clean and safe condition during the rental period.
          </p>

          <h3 className="text-2xl font-semibold text-[#0C2BA1]">
            5. Liability
          </h3>
          <p>
            5.1. We are not liable for any loss, injury, or damage to the
            Renter’s property or personal belongings during the rental period.
          </p>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="bg-[#0C2BA1] text-white p-3 rounded-md hover:bg-[#0A2590] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
