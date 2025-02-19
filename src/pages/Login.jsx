import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate(result.payload.role === "owner" ? "/landlorddashboard" : "/");
    } else {
      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: result.payload || "Invalid credentials. Please try again!",
      });
    }
  };

  const handleGoogleLogin = async () => {
    const result = await dispatch(loginWithGoogle());

    if (loginWithGoogle.fulfilled.match(result)) {
      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate(result.payload.role === "owner" ? "/landlorddashboard" : "/");
    } else {
      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: result.payload || "Something went wrong!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-[#0C2BA1] p-12 flex flex-col justify-between">
          <h1 className="text-4xl font-bold text-white mb-4">Flexora</h1>
          <p className="text-blue-100 leading-relaxed">
            Access your premium office space management platform.
          </p>
        </div>
        <div className="md:w-1/2 p-12 bg-white">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Welcome back
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-md"
                placeholder="Email"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border rounded-md"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-[#0C2BA1] text-white py-3 rounded-md"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-[#0C2BA1] text-white py-3 rounded-md flex items-center justify-center"
              >
                <img
                  src="https://img.icons8.com/color/24/000000/google-logo.png"
                  alt="Google"
                  className="mr-2"
                />
                Sign in with Google
              </button>
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#0C2BA1] font-medium">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
