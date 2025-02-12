import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import Swal from "sweetalert2";
import { signupUser } from "../features/authSlice";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [visitorName, setVisitorName] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
      role: "visitor",
      name: visitorName,
    };

    try {
      console.log("User Data:", userData);

      const response = await dispatch(signupUser(userData)).unwrap();

      console.log("Signup response:", response);

      if (response) {
        await Swal.fire({
          icon: "success",
          title: "Signup Successful",
          text: "Your account has been created successfully!",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate("/");
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

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg"
          >
            Create Account
          </button>

          {/* Link to Login Page */}
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
