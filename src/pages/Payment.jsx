import { useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2

const Payment = () => {
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• ••••");
  const [cardHolder, setCardHolder] = useState("FULL NAME");
  const [expiryDate, setExpiryDate] = useState("MM / YYYY");
  // const [securityCode, setSecurityCode] = useState("•••");

  const handlePayment = () => {
    // You can customize the SweetAlert content
    Swal.fire({
      icon: "success",
      title: "Payment Successful",
      text: "Your payment has been processed successfully.",
      confirmButtonText: "Okay",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-6">
      <div className="flex flex-wrap md:flex-nowrap bg-white p-6 rounded-xl shadow-xl gap-8 w-full max-w-4xl">
        <div className="w-full md:w-1/2">
          <div className="relative w-full h-56 rounded-xl p-5 text-white shadow-lg bg-gradient-to-r from-[#0C2BA1] to-[#183ac6] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)]"></div>

            <div className="absolute top-0 left-0 w-full h-10 bg-black/20"></div>

            <div className="absolute top-4 right-4">
              <img
                src="src/assets/bank.png"
                alt="Bank Logo"
                className="w-14 opacity-90"
              />
            </div>

            <div className="text-xl font-mono tracking-widest mt-10 text-center">
              {cardNumber}
            </div>

            <div className="flex justify-between mt-8 text-sm">
              <div>
                <span className="block text-xs opacity-70">VALID THRU</span>
                <span className="text-lg">{expiryDate}</span>
              </div>
              <div className="text-right">
                <span className="block text-xs opacity-70">CARDHOLDER</span>
                <span className="font-bold uppercase text-lg">
                  {cardHolder}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                type="text"
                maxLength="19"
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-[#0C2BA1]"
                placeholder="1234 5678 9012 3456"
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cardholder Name
              </label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-[#0C2BA1]"
                placeholder="Full Name"
                onChange={(e) => setCardHolder(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-[#0C2BA1]"
                  placeholder="MM / YYYY"
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Security Code
                </label>
                <input
                  type="text"
                  maxLength="3"
                  className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-[#0C2BA1]"
                  placeholder="CVC"
                />
              </div>
            </div>

            <button
              className="w-full bg-[#0C2BA1] text-white p-3 rounded-lg hover:bg-[#0C2BA1]/90 transition duration-300 shadow-md"
              onClick={handlePayment} // Trigger SweetAlert on click
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
