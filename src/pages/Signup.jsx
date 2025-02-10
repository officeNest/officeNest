import React from "react";
import { useState } from "react";
import { auth, db, googleProvider } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  getIdToken,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const schema = yup.object({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    number: yup.string().required("Mobile number is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const password = watch("password", "");
  const passwordStrength = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Get the user's ID token
      const idToken = await getIdToken(user);

      // Prepare the data to be stored in the Realtime Database
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        createdAt: new Date().toISOString(),
        emailVerified: false, // Add a field to track email verification status
      };

      // Firebase Realtime Database REST API URL
      const dbUrl = `https://task-manager-najjar-default-rtdb.firebaseio.com/users/${user.uid}.json?auth=${idToken}`;

      // Use Axios to store the data in the Realtime Database
      await axios.put(dbUrl, userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // Show success message and prompt the user to verify their email
      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Your account has been successfully created. Please check your email to verify your account.",
        confirmButtonText: "Continue",
        customClass: {
          confirmButton: "bg-indigo-600 text-white px-4 py-2 rounded-lg",
        },
      }).then(() => {
        // Redirect to a verification page or home page
        navigate("/verify-email"); // You can create a route for this page
      });
    } catch (error) {
      // Show error message
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
        confirmButtonText: "Try Again",
        customClass: {
          confirmButton: "bg-indigo-600 text-white px-4 py-2 rounded-lg",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Get the user's ID token
      const idToken = await getIdToken(user);

      // Prepare the data to be stored in the Realtime Database
      const userData = {
        firstName: user.displayName.split(" ")[0],
        lastName: user.displayName.split(" ")[1] || "",
        email: user.email,
        createdAt: new Date().toISOString(),
      };

      // Firebase Realtime Database REST API URL
      const dbUrl = `https://task-manager-najjar-default-rtdb.firebaseio.com/users/${user.uid}.json?auth=${idToken}`;

      // Use Axios to store the data in the Realtime Database
      await axios.put(dbUrl, userData);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Your account has been successfully created with Google.",
        confirmButtonText: "Continue",
        customClass: {
          confirmButton: "bg-indigo-600 text-white px-4 py-2 rounded-lg",
        },
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      // Show error message
      Swal.fire({
        icon: "error",
        title: "Google Sign-In Failed",
        text: error.message,
        confirmButtonText: "Try Again",
        customClass: {
          confirmButton: "bg-indigo-600 text-white px-4 py-2 rounded-lg",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Section - Visuals */}
        <div className="w-full md:w-1/2 bg-gradient-to-r from-purple-600 to-pink-600 p-10 flex flex-col justify-center items-center text-white relative">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              Welcome to <span className="text-yellow-300">EliteFit</span>
            </h1>
            <p className="text-lg mb-8 animate-fade-in-delay">
              Join the ultimate fashion destination. Sign up to explore the
              latest trends and exclusive collections.
            </p>
          </div>
          <div
            className="w-full h-64 bg-cover bg-center rounded-lg shadow-lg animate-float"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
            }}
          />
          <div className="absolute bottom-10 left-10 animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-yellow-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  {...register("firstName")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register("lastName")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
                  Mobile No.
                </label>
                <input
                  type="text"
                  {...register("number")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Enter mobile number"
                />
                {errors.number && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.number.message}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-purple-600"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition-all"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
