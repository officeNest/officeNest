import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { signupUser } from "../features/authSlice";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("visitor");
  const [visitorName, setVisitorName] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [propertyCount, setPropertyCount] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
      role,
      ...(role === "visitor" && { name: visitorName }),
      ...(role === "landlord" && {
        name: landlordName,
        propertyCount,
        businessName,
        phoneNumber,
        address,
      }),
    };

    try {
      console.log("User Data:", userData);

      const response = await dispatch(signupUser(userData)).unwrap();

      console.log("Signup response:", response);

      if (response.success) {
        console.log("Showing SweetAlert");
        await Swal.fire({
          icon: "success",
          title: "Signup Successful",
          text: "Your account has been created successfully!",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate(role === "visitor" ? "/" : "/login");
      }
    } catch (error) {
      console.error("Signup error:", error);

      await Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Create Account
        </h1>

        {/* Role Selection */}
        <div className="flex gap-4 mb-8">
          <button
            type="button"
            className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
              role === "visitor"
                ? "bg-blue-600 text-white shadow-md transform -translate-y-0.5"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setRole("visitor")}
          >
            Visitor
          </button>
          <button
            type="button"
            className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
              role === "landlord"
                ? "bg-blue-600 text-white shadow-md transform -translate-y-0.5"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setRole("landlord")}
          >
            Landlord
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          {role === "visitor" && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter your full name"
              />
            </div>
          )}

          {/* Email Field */}
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
              placeholder="your@email.com"
            />
          </div>

          {/* Password Field */}
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
                placeholder="Create a strong password"
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

          {/* Landlord Fields */}
          {role === "landlord" && (
            <>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={landlordName}
                  onChange={(e) => setLandlordName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Business name"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Phone number"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Business address"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
