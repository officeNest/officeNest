import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingOwnerRequests,
  updateRequestStatus,
} from "../features/requestsSlice";
import Sidebar from "./Sidebar";

const RequestsAdmin = () => {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(fetchPendingOwnerRequests());
  }, [dispatch]);

  const handleApproval = (requestId, status) => {
    dispatch(updateRequestStatus({ requestId, status }));
  };

  if (loading)
    return <div className="text-center text-lg text-[#0C2BA1]">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 w-full max-w-5xl">
        <h1 className="text-3xl font-semibold mb-6 text-[#0C2BA1]">
          Pending Owner Requests
        </h1>
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.uid}
              className="p-6 bg-white rounded-lg shadow-md border border-[#0C2BA1]/10"
            >
              <p className="font-semibold text-[#0C2BA1] text-lg mb-2">
                {request.name}
              </p>
              <p className="text-gray-600 mb-1">Email: {request.email}</p>
              <p className="text-gray-600 mb-1">Phone: {request.phoneNumber}</p>
              <p className="text-gray-600 mb-3">
                Status:{" "}
                <span className="font-bold text-[#0C2BA1]">
                  {request.status}
                </span>
              </p>
              {request.status === "pending" && (
                <div className="mt-4 flex space-x-3">
                  <button
                    className="px-4 py-2 bg-[#0C2BA1] text-white rounded hover:bg-[#0C2BA1]/90 transition-colors"
                    onClick={() => handleApproval(request.uid, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="px-4 py-2 border border-[#0C2BA1] text-[#0C2BA1] rounded hover:bg-[#0C2BA1]/5 transition-colors"
                    onClick={() => handleApproval(request.uid, "declined")}
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

export default RequestsAdmin;
