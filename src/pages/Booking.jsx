import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Calendar as CalendarIcon, Clock, Users } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ref, get } from "firebase/database";
import { db } from "../firebase"; // Import Firebase database instance
import { createBooking } from "../features/bookingSlice"; // Import the createBooking thunk

const Booking = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.bookings) || {
    loading: false,
  };

  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;
  const userId = userData ? userData.uid : null;

  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [checkInTime, setCheckInTime] = useState("12:00");
  const [checkOutTime, setCheckOutTime] = useState("12:00");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for T&C modal
  const [isTermsAccepted, setIsTermsAccepted] = useState(false); // State for T&C checkbox
  const [existingBookings, setExistingBookings] = useState([]); // State to store existing bookings

  // Fetch existing bookings for the property
  useEffect(() => {
    const fetchExistingBookings = async () => {
      try {
        const bookingsRef = ref(db, "bookings");
        const bookingsSnapshot = await get(bookingsRef);

        if (bookingsSnapshot.exists()) {
          const bookingsData = bookingsSnapshot.val();
          const propertyBookings = Object.values(bookingsData).filter(
            (booking) => booking.propertyId === propertyId
          );
          setExistingBookings(propertyBookings);
        }
      } catch (error) {
        console.error("Error fetching existing bookings:", error);
      }
    };

    fetchExistingBookings();
  }, [propertyId]);

  // Function to check if the selected date and time overlap with existing bookings
  const isDateTimeRangeAvailable = (checkIn, checkOut) => {
    const checkInDateTime = new Date(
      `${checkInDate.toDateString()} ${checkIn}`
    );
    const checkOutDateTime = new Date(
      `${checkOutDate.toDateString()} ${checkOut}`
    );

    for (const booking of existingBookings) {
      const existingCheckIn = new Date(
        `${new Date(booking.checkInDate).toDateString()} ${booking.checkInTime}`
      );
      const existingCheckOut = new Date(
        `${new Date(booking.checkOutDate).toDateString()} ${
          booking.checkOutTime
        }`
      );

      if (
        (checkInDateTime >= existingCheckIn &&
          checkInDateTime < existingCheckOut) ||
        (checkOutDateTime > existingCheckIn &&
          checkOutDateTime <= existingCheckOut) ||
        (checkInDateTime <= existingCheckIn &&
          checkOutDateTime >= existingCheckOut)
      ) {
        return false; // Date and time overlap
      }
    }
    return true; // Date and time are available
  };
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

    if (!checkInDate || !checkOutDate) {
      Swal.fire({
        icon: "error",
        title: "Invalid Dates",
        text: "Please select both check-in and check-out dates.",
      });
      return;
    }

    if (checkInDate >= checkOutDate) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date Range",
        text: "Check-in date must be before check-out date.",
      });
      return;
    }

    const currentDateTime = new Date();
    const checkInDateTime = new Date(
      `${checkInDate.toDateString()} ${checkInTime}`
    );
    const checkOutDateTime = new Date(
      `${checkOutDate.toDateString()} ${checkOutTime}`
    );

    if (checkInDateTime < currentDateTime) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date/Time",
        text: "Check-in date and time must be in the future.",
      });
      return;
    }

    if (checkOutDateTime <= checkInDateTime) {
      Swal.fire({
        icon: "error",
        title: "Invalid Time Range",
        text: "Check-out time must be after check-in time.",
      });
      return;
    }

    try {
      // Fetch property details from Firebase
      const propertyRef = ref(db, `properties/${propertyId}`);
      const propertySnapshot = await get(propertyRef);

      if (!propertySnapshot.exists()) {
        Swal.fire({
          icon: "error",
          title: "Property Not Found",
          text: "The property you are trying to book does not exist.",
        });
        return;
      }

      const propertyData = propertySnapshot.val();
      const capacity = propertyData.capacity; // Get the capacity of the property

      // Check if the number of people exceeds the capacity
      if (numberOfPeople > capacity) {
        Swal.fire({
          icon: "error",
          title: "Capacity Exceeded",
          text: `This property can only accommodate up to ${capacity} people.`,
        });
        return;
      }

      // Check if the selected date and time are available
      if (!isDateTimeRangeAvailable(checkInTime, checkOutTime)) {
        Swal.fire({
          icon: "error",
          title: "Date/Time Unavailable",
          text: "The selected date and time are already booked. Please choose a different slot.",
        });
        return;
      }

      const bookingData = {
        userId,
        propertyId,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        checkInTime,
        checkOutTime,
        numberOfPeople,
      };

      console.log("Dispatching booking data:", bookingData);

      // Dispatch the createBooking thunk
      await dispatch(createBooking(bookingData)).unwrap();

      // Show SweetAlert with booking details
      Swal.fire({
        icon: "success",
        title: "Booking Confirmed!",
        html: `
          <div>
            <p><strong>Check-in:</strong> ${new Date(
              checkInDate
            ).toLocaleDateString()} at ${checkInTime}</p>
            <p><strong>Check-out:</strong> ${new Date(
              checkOutDate
            ).toLocaleDateString()} at ${checkOutTime}</p>
            <p><strong>Number of People:</strong> ${numberOfPeople}</p>
          </div>
        `,
      });

      // Navigate to the payment page after successful booking creation
      navigate(
        `/payment/${propertyId}?checkInDate=${checkInDate.toISOString()}&checkOutDate=${checkOutDate.toISOString()}&checkInTime=${checkInTime}&checkOutTime=${checkOutTime}&numberOfPeople=${numberOfPeople}`
      );
    } catch (error) {
      console.error("Booking failed:", error);
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: error.message || "An error occurred while creating the booking.",
      });
    }
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-[#0C2BA1] text-center">
          Confirm Your Booking
        </h2>

        <form onSubmit={handleBooking} className="mt-6 space-y-6">
          {/* Check-in Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Check-in Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <CalendarIcon className="w-5 h-5 text-[#0C2BA1]" /> Check-in
                Date
              </label>
              <DatePicker
                selected={checkInDate}
                onChange={(date) => setCheckInDate(date)}
                selectsStart
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={new Date()}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#0C2BA1] focus:ring-2 focus:ring-[#0C2BA1] outline-none transition-all"
                required
              />
            </div>

            {/* Check-in Time */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="w-5 h-5 text-[#0C2BA1]" /> Check-in Time
              </label>
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#0C2BA1] focus:ring-2 focus:ring-[#0C2BA1] outline-none transition-all"
                required
              />
            </div>

            {/* Check-out Date and Time */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <CalendarIcon className="w-5 h-5 text-[#0C2BA1]" /> Check-out
                Date
              </label>
              <DatePicker
                selected={checkOutDate}
                onChange={(date) => setCheckOutDate(date)}
                selectsEnd
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={checkInDate || new Date()}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#0C2BA1] focus:ring-2 focus:ring-[#0C2BA1] outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="w-5 h-5 text-[#0C2BA1]" /> Check-out Time
              </label>
              <input
                type="time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#0C2BA1] focus:ring-2 focus:ring-[#0C2BA1] outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Number of People */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Number of People
            </label>
            <input
              type="number"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#0C2BA1] focus:ring-2 focus:ring-[#0C2BA1] outline-none transition-all"
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
                className="w-5 h-5 border border-gray-300 rounded-md focus:ring-[#0C2BA1]"
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
            disabled={loading || !isTermsAccepted}
            className="mt-6 w-full bg-[#0C2BA1] text-white p-4 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-[#0A2590] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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

// Terms and Conditions Modal
const TermsAndConditionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
        <h2 className="text-3xl font-bold text-[#0C2BA1] mb-6">
          Terms and Conditions for Renting Office Space
        </h2>
        {/* Modal content */}
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

export default Booking;
