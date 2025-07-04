import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { signupUser } from "../store/authSlice";
import { Input, Button } from "../component";
import { useLocation, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { Capacitor } from "@capacitor/core";
import {
  FaAccessibleIcon,
  FaGoogle,
  FaLock,
  FaLockOpen,
  FaRegCompass,
  FaRegEnvelope,
  FaRegUser,
  FaUnlock,
  FaUser,
} from "react-icons/fa";
import { SignUpWithGoogle } from "../service";
import { getUserFromGmailSignup } from "../utils/Api";
import { showSuccessToast } from "../utils/Toast";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const isApp = Capacitor.isNativePlatform();

export default function Signup({ onClick }) {
  const [isSigning, setIsSigning] = useState(false);
  const [isSigningGoogle, setIsSigningGoogle] = useState(false);
  const [showError, setShowError] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const { type } = location.state || {}; // Get the type passed from modal
  localStorage.setItem("userType", type);

  const getUserIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Failed to fetch IP address:", error);
      return null;
    }
  };
  const userAgent = navigator.userAgent;

  const handleSignup = async (userData) => {
    setIsSigning(true);
    setShowError(""); // Clear any previous error message

    const { name, email, password } = userData;
    const ipAddress = await getUserIP();
    // Fetch IP Address
    const payload = {
      name,
      email,
      password,
      type,
      userAgent,
      ipAddress,
    };
    ////console.log(payload, "signup form");

    try {
      const response = await dispatch(signupUser({ payload })).unwrap();
      if (response) {
        showSuccessToast("Successfully signed up!");
      }
      if (type == "employee") {
        navigate("/employee-profile"); // Redirect to employee dashboard
      } else if (type == "employer") {
        navigate("/employer-profile"); // Redirect to employer dashboard
      } else {
        navigate("/"); // Fallback if type is not provided
      }
      ////console.log("Signup response:", response);
    } catch (error) {
      console.error("API Signup failed:", error);
      if (error == "Firebase: Error (auth/email-already-in-use).") {
        setShowError("User already exists with this email.");
      } else {
        setShowError(error || "Signup failed. Please try again.");
      }
    } finally {
      setIsSigning(false);
    }
  };

  const password = watch("password");

  

  // Prevent numbers in text fields
  const handleNameKeyPress = (e) => {
    const charCode = e.keyCode || e.which;
    const charStr = String.fromCharCode(charCode);

    // Allow letters (a-z, A-Z) and spaces
    if (!/^[a-zA-Z\s]+$/.test(charStr)) {
      e.preventDefault();
    }
  };

  // Prevent non-numeric input in phone number and limit length
  const handlePhoneKeyPress = (e) => {
    const charCode = e.keyCode || e.which;
    const charStr = String.fromCharCode(charCode);
    if (!/^[0-9]+$/.test(charStr)) {
      e.preventDefault();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSignup)} className="mt-8">
      <div className="mt-2">
        <span className="sm:mb-6 flex flex-col sm:flex-row sm:space-x-2 ">
          <span className="w-full mb-4 sm:mb-0">
            <Input
              mainInput={"sm:w-full w-full"}
              icon={FaRegUser}
              type="text"
              placeholder="John"
              onKeyPress={handleNameKeyPress} // Prevent numbers
              {...register("name", {
                required: "Name is required",
                pattern: {
                  // Allow alphabets and spaces
                  value: /^[A-Za-z\s]+$/,
                  message: "Name should contain only alphabets and spaces",
                },
              })}
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </span>
          <span className="w-full mb-4 sm:mb-0">
            <Input
              mainInput={"sm:w-full w-full"}
              icon={FaRegEnvelope}
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </span>
        </span>

        <span className="mb-6 flex flex-col sm:flex-row sm:space-x-2 ">
          <span className="w-full mb-4 sm:mb-0">
            <Input
              mainInput={"sm:w-full w-full"}
              icon={FaUnlock}
              type="password"
              maxLength={10}
              minLength={6}
              placeholder="Enter your password"
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </span>
          <span className="w-full mb-4 sm:mb-0">
            <Input
              mainInput={"sm:w-full w-full"}
              icon={FaUnlock}
              type="password"
              maxLength={10}
              minLength={6}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </span>
        </span>

        <div className="form-control mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              {...register("terms", {
                required: "You must agree to the terms and privacy policies",
              })}
            />
            <p className="text-sm">
              I agree to all the Terms and Privacy Policies
            </p>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-xs mt-1">{errors.terms.message}</p>
          )}
        </div>
        {showError && <p className="text-red-500 text-xs mt-2">{showError}</p>}
        <span className="flex flex-col sm:flex-row sm:space-x-2 mt-10 mb-2">
          <Button
            type="submit"
            className={`w-full ${
              isSigning ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSigning}
          >
            {isSigning ? "Creating..." : "Create an account"}
          </Button>

          <span
            onClick={onClick}
            className={`bg-tn_dark_blue shadow-xl cursor-pointer transition duration-500 mt-3 sm:mt-0 sm:p-0 p-2 text-sm sm:text-lg ease-in-out hover:opacity-80 rounded-[100px] text-white flex items-center justify-center  w-full ${
              isSigningGoogle ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSigningGoogle}
          >
            <FaGoogle size={18} className="mr-2" />{" "}
            {isSigningGoogle ? "Signing..." : "Sign-up with google"}
          </span>
        </span>
      </div>
    </form>
  );
}
