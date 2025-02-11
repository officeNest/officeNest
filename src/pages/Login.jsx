import React, { useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  getIdToken,
  signInWithPopup,
} from "firebase/auth";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Reset Password",
      input: "email",
      inputLabel: "Enter your email address",
      inputPlaceholder: "Your email address",
      showCancelButton: true,
      confirmButtonText: "Send Reset Code",
      inputValidator: (value) => {
        if (!value) {
          return "You need to enter your email!";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address!";
        }
      },
    });

    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        Swal.fire({
          icon: "success",
          title: "Email Sent!",
          text: "A password reset code has been sent to your email address.",
        }).then(async () => {
          const { value: code } = await Swal.fire({
            title: "Enter Reset Code",
            input: "text",
            inputLabel: "Enter the reset code sent to your email",
            inputPlaceholder: "Reset code",
            showCancelButton: true,
            confirmButtonText: "Verify Code",
            inputValidator: (value) => {
              if (!value) {
                return "You need to enter the reset code!";
              }
            },
          });

          if (code) {
            const { value: newPassword } = await Swal.fire({
              title: "Enter New Password",
              input: "password",
              inputLabel: "Enter your new password",
              inputPlaceholder: "New password",
              showCancelButton: true,
              confirmButtonText: "Reset Password",
              inputValidator: (value) => {
                if (!value) {
                  return "You need to enter a new password!";
                }
                if (value.length < 6) {
                  return "Password must be at least 6 characters long!";
                }
              },
            });

            if (newPassword) {
              await confirmPasswordReset(auth, code, newPassword);
              Swal.fire({
                icon: "success",
                title: "Password Reset Successful!",
                text: "Your password has been updated successfully.",
              });
            }
          }
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await getIdToken(user);
      const dbUrl = `https://officenest-380c1-default-rtdb.firebaseio.com/users/${user.uid}.json?auth=${idToken}`;
      const response = await axios.get(dbUrl);

      if (response.data) {
        const userData = response.data;
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: `Welcome back, ${userData.firstName || user.email}!`,
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "User data not found.",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Sign-In Failed",
        text: error.message,
        confirmButtonText: "Try Again",
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      const idToken = await getIdToken(user);
      const dbUrl = `https://officenest-380c1-default-rtdb.firebaseio.com/users/${user.uid}.json?auth=${idToken}`;
      const response = await axios.get(dbUrl);

      if (response.data) {
        const userData = response.data;
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: `Welcome back, ${userData.firstName || user.email}!`,
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "User data not found.",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-[#244D4D] p-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Office Rent Platform
          </h1>
          <p className="text-lg text-gray-200">
            Sign in to manage your office spaces or find the perfect workspace.
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-[#244D4D] mb-6">
            Sign In
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#244D4D] focus:border-transparent"
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#244D4D] focus:border-transparent"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-[#244D4D]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#244D4D] focus:ring-[#244D4D] border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-[#244D4D] hover:text-[#1A3A3A]"
              >
                Forgot password?
              </button>
            </div>
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-[#244D4D] text-white rounded-lg hover:bg-[#1A3A3A] focus:ring-2 focus:ring-[#244D4D] focus:ring-offset-2 transition-all"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  "Sign In"
                )}
              </button>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#244D4D] transition-colors duration-200 mt-4"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                  className="h-5 w-5"
                />
                <span>Sign in with Google</span>
              </button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#244D4D] hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
