import React, { useState } from "react";
import { auth, db } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import { createUserWithEmailAndPassword, getIdToken } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const SignUpLandlord = () => {
  const schema = yup.object({
    fullName: yup.string().required("Full Name is required"),
    phoneNumber: yup.string().required("Phone Number is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    nationalId: yup.string(),
    propertyName: yup.string().required("Property Name is required"),
    propertyAddress: yup.string().required("Property Address is required"),
    numberOfOffices: yup
      .number()
      .typeError("Number of Offices must be a number")
      .required("Number of Offices is required"),
    propertyRegistrationNumber: yup.string(),
    proofOfOwnership: yup.mixed().required("Proof of Ownership is required"),
    idOrBusinessRegistration: yup
      .mixed()
      .required("ID or Business Registration Certificate is required"),
    utilityBill: yup.mixed(),
    agreeToTerms: yup
      .boolean()
      .oneOf([true], "You must agree to the Terms & Conditions"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
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
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        nationalId: data.nationalId,
        propertyName: data.propertyName,
        propertyAddress: data.propertyAddress,
        numberOfOffices: data.numberOfOffices,
        propertyRegistrationNumber: data.propertyRegistrationNumber,
        proofOfOwnership: data.proofOfOwnership[0].name,
        idOrBusinessRegistration: data.idOrBusinessRegistration[0].name,
        utilityBill: data.utilityBill ? data.utilityBill[0].name : null,
        agreeToTerms: data.agreeToTerms,
        createdAt: new Date().toISOString(),
        emailVerified: false,
        role: "landlord",
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-[#244D4D] p-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Office Rent Platform
          </h1>
          <p className="text-lg text-gray-200">
            List your office spaces and manage them with ease.
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-[#244D4D] mb-6">
            Landlord Verification Form
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-semibold text-[#244D4D] mb-4">
                1. Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register("fullName")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#244D4D] focus:border-transparent"
                    placeholder="Enter full name"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    {...register("phoneNumber")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#244D4D] focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
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
                    National ID / Passport Number (Optional)
                  </label>
                  <input
                    type="text"
                    {...register("nationalId")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#244D4D] focus:border-transparent"
                    placeholder="Enter national ID or passport number"
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div>
              <h3 className="text-xl font-semibold text-[#244D4D] mb-4">
                2. Property Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Name / Business Name
                  </label>
                  <input
                    type="text"
                    {...register("propertyName")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#244D4D] focus:border-transparent"
                    placeholder="Enter property or business name"
                  />
                  {errors.propertyName && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.propertyName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Address
                  </label>
                  <input
                    type="text"
                    {...register("propertyAddress")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#244D4D] focus:border-transparent"
                    placeholder="Enter property address"
                  />
                  {errors.propertyAddress && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.propertyAddress.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Offices Available for Rent
                  </label>
                  <input
                    type="number"
                    {...register("numberOfOffices")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#244D4D] focus:border-transparent"
                    placeholder="Enter number of offices"
                  />
                  {errors.numberOfOffices && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.numberOfOffices.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Registration Number (Optional)
                  </label>
                  <input
                    type="text"
                    {...register("propertyRegistrationNumber")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#244D4D] focus:border-transparent"
                    placeholder="Enter property registration number"
                  />
                </div>
              </div>
            </div>

            {/* Required Documents */}
            <div>
              <h3 className="text-xl font-semibold text-[#244D4D] mb-4">
                3. Required Documents (Upload as PDF or Image)
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proof of Ownership (Ownership deed / lease agreement)
                  </label>
                  <input
                    type="file"
                    {...register("proofOfOwnership")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#244D4D] focus:border-transparent"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {errors.proofOfOwnership && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.proofOfOwnership.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID or Business Registration Certificate
                  </label>
                  <input
                    type="file"
                    {...register("idOrBusinessRegistration")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#244D4D] focus:border-transparent"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {errors.idOrBusinessRegistration && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.idOrBusinessRegistration.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recent Utility Bill (Optional)
                  </label>
                  <input
                    type="file"
                    {...register("utilityBill")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#244D4D] focus:border-transparent"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
              </div>
            </div>

            {/* Agreement & Verification */}
            <div>
              <h3 className="text-xl font-semibold text-[#244D4D] mb-4">
                4. Agreement & Verification
              </h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("agreeToTerms")}
                  className="w-4 h-4 text-[#244D4D] border-gray-300 rounded focus:ring-[#244D4D]"
                />
                <label className="ml-2 text-sm text-gray-700">
                  I confirm that all the provided information is accurate and I
                  agree to the Terms & Conditions.
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.agreeToTerms.message}
                </p>
              )}
            </div>

            {/* Password Fields */}
            <div>
              <h3 className="text-xl font-semibold text-[#244D4D] mb-4">
                Account Credentials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-[#244D4D] text-white rounded-lg hover:bg-[#1A3A3A] focus:ring-2 focus:ring-[#244D4D] focus:ring-offset-2 transition-all"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  "Submit"
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

export default SignUpLandlord;
