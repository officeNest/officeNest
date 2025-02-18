import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { signupUser, loginWithGoogle } from "../features/authSlice";
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
      await dispatch(signupUser({ email, password, name: visitorName }));

      await Swal.fire({
        icon: "success",
        title: "Signup Successful",
        text: "Your account has been created successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      await Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.message || "Something went wrong!",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await dispatch(loginWithGoogle()).unwrap();

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
      await Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left side - Brand Section */}
        <div className="md:w-1/2 bg-[#0C2BA1] p-12 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Flexora</h1>
            <div className="h-1 w-20 bg-white mb-8"></div>
            <h2 className="text-2xl font-light text-white mb-6">
              Join Our Professional Network
            </h2>
            <p className="text-blue-100 leading-relaxed">
              Create your account to access premium office spaces and unlock a
              world of professional workspace solutions. Join thousands of
              businesses already thriving with Flexora.
            </p>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4 text-blue-100">
              <div className="w-px h-8 bg-blue-200"></div>
              <p className="text-sm">
                Verified Business Network • Instant Access • Global Availability
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Signup Form */}
        <div className="md:w-1/2 p-12 bg-white">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600 mb-8">
              Fill in your details to get started with Flexora.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#0C2BA1] focus:border-[#0C2BA1] transition-all outline-none"
                  placeholder="John Smith"
                />
              </div>

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
                    placeholder="Create a strong password"
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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="h-4 w-4 text-[#0C2BA1] focus:ring-[#0C2BA1] border-gray-300 rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-[#0C2BA1] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-[#0C2BA1] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0C2BA1] text-white py-3 rounded-md hover:bg-[#0A247A] transition-colors duration-200 font-medium"
              >
                Create Account
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-[#0C2BA1] text-white py-3 rounded-md hover:bg-[#0A247A] transition-colors duration-200 font-medium flex items-center justify-center"
              >
                <img
                  src="https://img.icons8.com/color/24/000000/google-logo.png"
                  alt="Google Logo"
                  className="mr-2"
                />
                Sign up with Google
              </button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#0C2BA1] font-medium hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-[#0C2BA1] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-[#0C2BA1] hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
