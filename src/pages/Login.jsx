import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginUser } from "../features/authSlice";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(loginUser({ email, password })).unwrap();

      if (response.success) {
        // Check if the role is "landlord" and the status is "approved"
        if (response.role === "landlord") {
          if (response.status === "approved") {
            // Show success alert if the landlord is approved
            await Swal.fire({
              icon: "success",
              title: "Login Successful",
              text: "Welcome back, approved landlord!",
              timer: 2000,
              showConfirmButton: false,
            });
            // Navigate to the landlord dashboard
            navigate("/dashboard");
          } else {
            // Show warning if the landlord is not approved yet
            await Swal.fire({
              icon: "warning",
              title: "Approval Pending",
              text: "Your account is awaiting approval from the admin.",
            });
          }
        } else {
          // If the user is not a landlord, navigate to the home page
          await Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: "Welcome back!",
            timer: 2000,
            showConfirmButton: false,
          });
          navigate("/");
        }
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Invalid credentials. Please try again!",
      });
    }
  };

  const fetchLandlordStatus = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      console.log("Fetched landlord status:", data.status);
      return data.status;
    } catch (error) {
      console.error("Error fetching landlord status:", error);
      return "pending";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
