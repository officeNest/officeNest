import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { loginUser, loginWithGoogle } from "../features/authSlice";
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
      await dispatch(loginUser(email, password));
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        console.log("User data stored in localStorage:", user);
        console.log("User role:", user.role);

        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back!",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate(user.role === "owner" ? "/landlorddashboard" : "/");
      } else {
        throw new Error("Failed to store user data.");
      }
    } catch (error) {
      console.error("Login error:", error);
      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Invalid credentials. Please try again!",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await dispatch(loginWithGoogle());
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back!",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate(user.role === "owner" ? "/landlorddashboard" : "/");
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-[#0C2BA1] p-12 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Flexora</h1>
            <div className="h-1 w-20 bg-white mb-8"></div>
            <h2 className="text-2xl font-light text-white mb-6">
              Professional Workspace Solutions
            </h2>
            <p className="text-blue-100 leading-relaxed">
              Access your premium office space management platform. Streamline
              your workspace experience with our advanced tools and services.
            </p>
          </div>
        </div>

        <div className="md:w-1/2 p-12 bg-white">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600 mb-8">
              Please enter your credentials to access your account.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#0C2BA1] focus:border-[#0C2BA1] transition-all outline-none"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#0C2BA1] focus:border-[#0C2BA1] transition-all outline-none"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#0C2BA1] text-white py-3 rounded-md hover:bg-[#0A247A] transition-colors duration-200 font-medium"
              >
                Sign in to your account
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors duration-200 font-medium flex items-center justify-center"
              >
                <img
                  src="https://img.icons8.com/color/24/000000/google-logo.png"
                  alt="Google Logo"
                  className="mr-2"
                />
                Sign in with Google
              </button>
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#0C2BA1] font-medium hover:underline"
                >
                  Create an account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
