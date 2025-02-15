import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ref, set } from "firebase/database";
import { db } from "/src/firebase.jsx";
import Swal from "sweetalert2";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract propertyId from URL manually
  const pathParts = window.location.pathname.split("/");
  const propertyId = pathParts[pathParts.length - 1]; // Get last part of path

  // Extract booking details from URL query parameters
  const checkInDate = searchParams.get("checkInDate") || "N/A";
  const checkOutDate = searchParams.get("checkOutDate") || "N/A";
  const numberOfPeople = searchParams.get("numberOfPeople") || "1";

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");

  useEffect(() => {
    console.log("Extracted propertyId:", propertyId);
  }, [propertyId]);

  const handlePayment = async () => {
    if (!propertyId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Property ID is missing. Please try again.",
      });
      return;
    }

    const paymentData = {
      propertyId,
      checkInDate,
      checkOutDate,
      numberOfPeople,
      cardNumber,
      cardHolder,
      expiryDate,
      cvc,
      timestamp: new Date().toISOString(),
    };

    // Save payment data to the "payment" collection
    const paymentRef = ref(db, `payments/${propertyId}`); // Use propertyId as the key

    set(paymentRef, paymentData)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Payment Successful",
          text: "Your payment has been confirmed!",
        });
        navigate("/");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: error.message || "Something went wrong.",
        });
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center text-[#0C2BA1] mb-8">
          Complete Your Booking
        </h1>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Booking Summary */}
          <div className="p-8 bg-[#0C2BA1]/10 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-[#0C2BA1] mb-6">
              Booking Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <span className="text-gray-600">Property ID:</span>
                <span className="font-medium text-gray-800">{propertyId}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium text-gray-800">{checkInDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium text-gray-800">
                  {checkOutDate}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">Guests:</span>
                <span className="font-medium text-gray-800">
                  {numberOfPeople}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-[#0C2BA1] mb-8">
              Payment Details
            </h2>

            <div className="space-y-8">
              {/* Credit Card Preview */}
              <div
                className="relative w-full h-64 rounded-2xl p-8 text-white shadow-lg 
                          bg-gradient-to-r from-[#0C2BA1] to-[#2a43b1] overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent)]"></div>

                {/* Card Logo */}
                <div className="flex justify-between items-start">
                  <div className="w-14 h-10 bg-yellow-300/80 rounded-lg"></div>
                  <div className="text-sm opacity-80 font-medium">DEBIT</div>
                </div>

                {/* Card Number */}
                <div className="text-2xl font-mono tracking-widest mt-10">
                  {cardNumber || "0000 0000 0000 0000"}
                </div>

                <div className="flex justify-between mt-12 text-sm">
                  <div>
                    <span className="block text-xs opacity-70">VALID THRU</span>
                    <span className="text-lg">{expiryDate || "00/00"}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs opacity-70">CARDHOLDER</span>
                    <span className="font-medium uppercase text-lg truncate max-w-[180px]">
                      {cardHolder || "YOUR FULL NAME"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 gap-6">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0C2BA1] focus:border-[#0C2BA1]"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                      const formattedValue = value
                        .replace(/(\d{4})/g, "$1 ") // Add space every 4 digits
                        .trim();
                      setCardNumber(formattedValue);
                    }}
                    maxLength={19}
                  />
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0C2BA1] focus:border-[#0C2BA1]"
                    placeholder="First Middle Last Name"
                    value={cardHolder}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Allow only letters and spaces
                      setCardHolder(value);
                    }}
                  />
                </div>

                {/* Expiry Date and CVC */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0C2BA1] focus:border-[#0C2BA1]"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                        const formattedValue = value
                          .replace(/^(\d{2})(\d{0,2})/, "$1/$2") // Add slash after 2 digits
                          .substring(0, 5); // Limit to MM/YY format
                        setExpiryDate(formattedValue);
                      }}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Security Code (CVC)
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0C2BA1] focus:border-[#0C2BA1]"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                        setCvc(value.substring(0, 3)); // Limit to 3 digits
                      }}
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handlePayment}
                className="w-full bg-[#0C2BA1] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#0A2490] transition duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <span>Complete Payment</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
