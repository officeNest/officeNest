import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingOwnerRequests, updateRequestStatus } from "../features/requestsSlice";
import { init, send } from 'emailjs-com'; // Import EmailJS functions
import Nav from "./Nav";

const UserRequests = () => {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector((state) => state.requests);

  // Initialize EmailJS with your User ID (you can find this in your EmailJS dashboard)
  useEffect(() => {
    init("your_user_id"); // Replace with your actual EmailJS User ID
  }, []);

  const handleApproval = async (requestId, status, userEmail) => {
    // Dispatch update request status
    dispatch(updateRequestStatus({ requestId, status }));

    // If approved, send email using EmailJS
    if (status === "approved") {
      const templateParams = {
        to_email: userEmail,
        message: 'Your request has been approved! Please proceed with completing the payment process to confirm your booking.',
        subject: 'Complete Payment Process'
      };

      try {
        // Send email using EmailJS
        await send('your_service_id', 'your_template_id', templateParams);
        console.log('Email sent successfully');
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    }
  };

  if (loading) return <div className="text-center text-lg text-[#0C2BA1]">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex">
      <Nav/>
      <div className="p-6 w-full max-w-5xl">
        <h1 className="text-3xl font-semibold mb-6 text-[#0C2BA1]">User Requests</h1>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.uid} className="p-6 bg-white rounded-lg shadow-md border border-[#0C2BA1]/10">
              <p className="font-semibold text-[#0C2BA1] text-lg mb-2">{request.visitorName}</p>
              <p className="text-gray-600 mb-1">Property: {request.propertyName}</p>
              <p className="text-gray-600 mb-1">Status: <span className="font-bold text-[#0C2BA1]">{request.status}</span></p>
              {request.status === "pending" && (
                <div className="mt-4 flex space-x-3">
                  <button
                    className="px-4 py-2 bg-[#0C2BA1] text-white rounded hover:bg-[#0C2BA1]/90 transition-colors"
                    onClick={() => handleApproval(request.uid, "approved", request.userEmail)} // Pass userEmail
                  >
                    Approve
                  </button>
                  <button
                    className="px-4 py-2 border border-[#0C2BA1] text-[#0C2BA1] rounded hover:bg-[#0C2BA1]/5 transition-colors"
                    onClick={() => handleApproval(request.uid, "declined", request.userEmail)}
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserRequests;
