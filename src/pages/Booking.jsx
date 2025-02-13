import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, ref, push, onValue } from "../firebase";
import Swal from "sweetalert2";
import { Calendar, Users, ArrowRight } from "lucide-react";


const Booking = () => {
  const { id: propertyId } = useParams();
  const navigate = useNavigate();

  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).uid : null;

  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const bookingsRef = ref(db, "bookings");
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const bookingsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setBookings(bookingsArray);
      } else {
        setBookings([]);
      }
    });
    return () => unsubscribe();
  }, []);

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

    setIsLoading(true);

    try {
      const bookingsRef = ref(db, "bookings");
      await push(bookingsRef, {
        userId,
        propertyId,
        checkInDate,
        checkOutDate,
        numberOfPeople,
        bookingDate: new Date().toISOString(),
        status: "pending",
      });

      Swal.fire({
        icon: "success",
        title: "Booking Confirmed",
        text: "Your booking request has been sent successfully!",
        confirmButtonText: "OK",
      });

      navigate("/");
    } catch (error) {
      console.error("Error creating booking:", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-[#0C2BA1]">
          Confirm Your Booking
        </h2>
        <p>
          Property ID: <span className="font-semibold">{propertyId}</span>
        </p>

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
                className="w-full p-3 border border-gray-300 rounded-lg"
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
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Users className="w-4 h-4 text-[#0C2BA1]" /> Number of People
            </label>
            <input
              type="number"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              className="mr-2"
              required
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-700 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              I agree to the{" "}
              <span className="text-[#0C2BA1]">Terms and Conditions</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full bg-[#0C2BA1] text-white p-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors duration-200 disabled:bg-gray-400"
          >
            {isLoading ? (
              "Processing..."
            ) : (
              <>
                Confirm Booking <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <h2 className="text-lg font-semibold mt-6">Live Bookings</h2>
        <ul className="mt-2 text-gray-600">
          {bookings.map((booking) => (
            <li key={booking.id}>
              {booking.userId} booked Property {booking.propertyId} -{" "}
              {booking.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Booking;
