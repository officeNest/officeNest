import React, { useState } from "react";
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

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      const idToken = await getIdToken(user);

      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        createdAt: new Date().toISOString(),
        emailVerified: false,
        role: "visitor",
      };

      const dbUrl = `https://officenest-380c1-default-rtdb.firebaseio.com/users/${user.uid}.json?auth=${idToken}`;

      await axios.put(dbUrl, userData);
      localStorage.setItem("user", JSON.stringify(userData));

      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Your account has been successfully created. Please check your email to verify your account.",
        confirmButtonText: "Continue",
        customClass: {
          confirmButton: "bg-[#244D4D] text-white px-4 py-2 rounded-lg",
        },
      }).then(() => {
        navigate("/verify-email");
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
        confirmButtonText: "Try Again",
        customClass: {
          confirmButton: "bg-[#244D4D] text-white px-4 py-2 rounded-lg",
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

      const idToken = await getIdToken(user);

      const userData = {
        firstName: user.displayName.split(" ")[0],
        lastName: user.displayName.split(" ")[1] || "",
        email: user.email,
        createdAt: new Date().toISOString(),
      };

      const dbUrl = `https://officenest-380c1-default-rtdb.firebaseio.com/users/${user.uid}.json?auth=${idToken}`;

      await axios.put(dbUrl, userData);

      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Your account has been successfully created with Google.",
        confirmButtonText: "Continue",
        customClass: {
          confirmButton: "bg-[#244D4D] text-white px-4 py-2 rounded-lg",
        },
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Sign-In Failed",
        text: error.message,
        confirmButtonText: "Try Again",
        customClass: {
          confirmButton: "bg-[#244D4D] text-white px-4 py-2 rounded-lg",
        },
      });
    } finally {
      setIsLoading(false);
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
            Find the best office spaces for rent.
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-[#244D4D] mb-6">
            Visitor Sign Up
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  {...register("firstName")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#244D4D] focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#244D4D] focus:border-transparent"
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
                  Mobile No.
                </label>
                <input
                  type="text"
                  {...register("number")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#244D4D] focus:border-transparent"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#244D4D] focus:border-transparent"
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
                className="w-full px-4 py-2 bg-[#244D4D] text-white rounded-lg hover:bg-[#1A3A3A] focus:ring-2 focus:ring-[#244D4D] focus:ring-offset-2 transition-all"
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
              <Link to="/login" className="text-[#244D4D] hover:underline">
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
