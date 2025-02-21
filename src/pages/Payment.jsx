import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ref, set,update } from "firebase/database";
import { db } from "/src/firebase.jsx";
import Swal from "sweetalert2";
import { getAuth } from "firebase/auth";

  const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const pathParts = window.location.pathname.split("/");
  const propertyId = pathParts[pathParts.length - 1];

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
  


  //////////////////////////////////////////////////


  // Function to validate card number using Luhn algorithm
  const validateCardNumber = (cardNumber) => {
    const cleanedCardNumber = cardNumber.replace(/\D/g, "");
    let sum = 0;
    for (let i = 0; i < cleanedCardNumber.length; i++) {
      let digit = parseInt(cleanedCardNumber[i]);
      if ((cleanedCardNumber.length - i) % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  };

  // Function to validate expiry date (with max 12 months and not in the past)
  const validateExpiryDate = (expiryDate) => {
    const [month, year] = expiryDate.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    // Check if the month is between 01 and 12
    if (month < 1 || month > 12) {
      return false;
    }

    // Check if the year is in the future or the same year with a valid month
    if (year < currentYear || (year == currentYear && month < currentMonth)) {
      return false;
    }
    return true;
  };

  // Function to validate CVC (must be 3 digits and not "000")
  const validateCVC = (cvc) => {
    return cvc.length === 3 && /^\d+$/.test(cvc) && cvc !== "000";
  };


  /////////////////////////////////////////////////////////////////

  const handlePayment = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User not authenticated. Please log in.",
      });
      return;
    }

    if (!propertyId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Property ID is missing. Please try again.",
      });
      return;
    }

    // Validate card number
    if (!validateCardNumber(cardNumber)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Card Number",
        text: "Please enter a valid card number.",
      });
      return;
    }

    // Validate expiry date
    if (!validateExpiryDate(expiryDate)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Expiry Date",
        text: "Please enter a valid expiry date.",
      });
      return;
    }

    // Validate CVC
    if (!validateCVC(cvc)) {
      Swal.fire({
        icon: "error",
        title: "Invalid CVV",
        text: "Please enter a valid CVC (cannot be 000).",
      });
      return;
    }

    const paymentData = {
      userId: user.uid,
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

    const paymentRef = ref(db, `payments/${user.uid}`);
    const userRef = ref(db, `users/${user.uid}`);


    
  try {
    // Save payment data
    await set(paymentRef, paymentData);

    // Update user's flage to true in Firebase
    await update(userRef, { flage: true });

    // Update the user data in localStorage
    const storedUserData = JSON.parse(localStorage.getItem("user"));
    if (storedUserData) {
      storedUserData.flage = true; // Update flage field
      localStorage.setItem("user", JSON.stringify(storedUserData)); // Save updated data
    }

    Swal.fire({
      icon: "success",
      title: "Payment Successful",
      text: "Your payment has been confirmed!",
    });

    navigate("/");
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Payment Failed",
      text: error.message || "Something went wrong.",
    });
  }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-10">
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
                        let formattedValue = value.replace(
                          /^(\d{2})(\d{0,2})/,
                          "$1/$2"
                        ); // Add slash after 2 digits

                        // Limit the month part to 12
                        const month = formattedValue.substring(0, 2);
                        if (parseInt(month) > 12) {
                          formattedValue =
                            "12/" + formattedValue.substring(3, 5); // Set the month to 12 if greater
                        }

                        setExpiryDate(formattedValue.substring(0, 5)); // Limit to MM/YY format
                      }}
                      maxLength={5}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0C2BA1] focus:border-[#0C2BA1]"
                      placeholder="CVV"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handlePayment}
                  className="w-full py-3 px-6 bg-[#0C2BA1] text-white font-medium text-lg rounded-lg hover:bg-[#2a43b1] transition-all duration-200"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
