import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { signupUser } from "../store/authSlice";
import { Input, Button } from "../component";
import { useLocation, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { Capacitor } from "@capacitor/core";
import { FaAccessibleIcon, FaGoogle, FaLock, FaLockOpen, FaRegCompass, FaRegEnvelope, FaRegUser, FaUnlock, FaUser } from "react-icons/fa";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const isApp = Capacitor.isNativePlatform();

export default function Signup({ onClick }) {
  const [isSigning, setIsSigning] = useState(false);
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
  const handleSignup = async (userData) => {
    setIsSigning(true);
    setShowError(""); // Clear any previous error message
    const userAgent = navigator.userAgent;

    const { name, email, password } = userData;
    // Fetch IP Address
    const ipAddress = await getUserIP();
    const payload = {
      name,
      email,
      password,
      type,
      userAgent,
      ipAddress,
    };
    console.log(payload, "signup form");

    try {
      const response = await dispatch(signupUser({ payload })).unwrap();
      if (type == "employee") {
        navigate("/employee"); // Redirect to employee dashboard
      } else if (type == "employer") {
        navigate("/employer"); // Redirect to employer dashboard
      } else {
        navigate("/"); // Fallback if type is not provided
      }
      console.log("Signup response:", response);
      // Navigate to home or another page
      navigate("/"); // Adjust the navigation as needed
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

  // const handleRecaptchaChange = (value) => {
  //   setRecaptchaToken(value);
  // };

  // Prevent numbers in text fields
  const handleNameKeyPress = (e) => {
    const charCode = e.keyCode || e.which;
    const charStr = String.fromCharCode(charCode);
    if (!/^[a-zA-Z]+$/.test(charStr)) {
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
        <span className="mb-6 flex space-x-2">
          <Input
            mainInput={"sm:w-full w-full"}
            icon={FaRegUser}
            type="text"
            placeholder="John"
            onKeyPress={handleNameKeyPress} // Prevent numbers
            {...register("name", {
              pattern: {
                value: /^[A-Za-z]+$/,
                message: "First name should contain only alphabets",
              },
            })}
          />
          {errors.fname && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
          <span className="w-full">
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

        <span className="mb-6 flex space-x-2">
          <span className="w-full">
            <Input
              mainInput={"sm:w-full w-full"}
              icon={FaUnlock}
              type="password"
              maxLength={10}
              minLength={6}
              placeholder="Enter your password"
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
          <span className="w-full">
            <Input
              mainInput={"sm:w-full w-full"}
              icon={FaUnlock}
              type="password"
              maxLength={10}
              minLength={6}
              placeholder="Re-enter your password"
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

        <span className="flex space-x-2 mt-10 mb-2">
          <Button
            type="submit"
            className={`w-full ${isSigning ? "opacity-70 cursor-not-allowed" : ""
              }`}
            disabled={isSigning}
          >
            {isSigning ? "Creating..." : "Create an account"}
          </Button>

          <span

            onClick={onClick}
            className={`bg-tn_dark_blue shadow-xl cursor-pointer transition duration-500 ease-in-out hover:opacity-80 rounded-[100px] text-white flex items-center justify-center  w-full ${isSigning ? "opacity-70 cursor-not-allowed" : ""
              }`}
            disabled={isSigning}
          >
            <FaGoogle size={18} className="mr-2"/> {isSigning ? "Signing..." : "Sign-up with google"}
          </span>
        </span>
      </div>
    </form>
  );
}
