import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';


const UserRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        'https://officenest-380c1-default-rtdb.firebaseio.com/bookings.json'
      );

      if (response.data) {
        const bookingsArray = Object.entries(response.data)
          .map(([id, data]) => ({
            id,
            ...data
          }))
          .filter(booking => booking.ownerId === user.uid)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setBookings(bookingsArray);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(
        `https://officenest-380c1-default-rtdb.firebaseio.com/bookings/${bookingId}.json`,
        { status }
      );

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      ));

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: `Booking ${status} successfully!`,
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update booking status.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#0C2BA1]">Booking Requests</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center text-gray-600">
          No booking requests found.
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div 
              key={booking.id} 
              className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#0C2BA1]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{booking.propertyName}</h2>
                  <p className="text-gray-600">
                    <span className="font-medium">Requested by:</span> {booking.userName}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {booking.userEmail}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Number of People:</span> {booking.numberOfPeople}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Check-in:</span> {new Date(booking.checkInDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Check-out:</span> {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`font-semibold ${
                      booking.status === 'approved' ? 'text-green-600' :
                      booking.status === 'rejected' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </p>
                </div>
              </div>

              {booking.status === 'pending' && (
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => handleBookingStatus(booking.id, 'approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleBookingStatus(booking.id, 'rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRequests;