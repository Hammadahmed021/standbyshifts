import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input, Button } from "../component";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/authSlice";
import { FaGoogle, FaRegEnvelope, FaUnlock } from "react-icons/fa";
import { SignUpWithGoogle } from "../service";
import { getUserFromGmailLogin } from "../utils/Api";
import { showSuccessToast } from "../utils/Toast";

export default function Login({ onClick }) {
  const [isSigning, setIsSigning] = useState(false);
  const [isSigningGoogle, setIsSigningGoogle] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
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

  const LoginSubmit = async (userData) => {
    setIsSigning(true); // Assuming you have setIsSigning state

    const { email, password } = userData;
    // Fetch IP Address
    const ipAddress = await getUserIP();
    const payload = {
      email,
      password,
      type,
      userAgent,
      ipAddress,
    };
    ////console.log(payload, "payload");

    try {
      const loginResponse = await dispatch(loginUser({ payload })).unwrap();
      if(loginResponse){
        showSuccessToast("Successfully logged in!");
      }
      if (type == "employee") {
        navigate("/employee"); // Redirect to employee dashboard
      } else if (type == "employer") {
        navigate("/employer"); // Redirect to employer dashboard
      } else {
        navigate("/"); // Fallback if type is not provided
      }
      ////console.log("Login Response:", loginResponse);
      // Handle success, navigate user or update UI
    } catch (error) {
      console.error("Login failed:", error);
      if (error == "auth/wrong-password") {
        setError("Password is wrong");
      } else if (error == "auth/user-not-found") {
        setError("User does not exist");
      } else {
        setError("Please enter correct email or password."); // Generic error message
      }
      // Handle error, show error message or retry
    } finally {
      setIsSigning(false); // Reset signing state
    }
  };

  

  return (
    <>
      {/* {errors && <p className="text-red-600 mt-8 text-center">{errors}</p>} */}

      <form onSubmit={handleSubmit(LoginSubmit)} className="mt-8">
        <div className="">
          <span className="mb-6 block">
            <Input
              mainInput={"sm:w-full w-full"}
              label="Email"
              icon={FaRegEnvelope}
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                Enter valid email address
              </p>
            )}
          </span>
          <span className="mb-1 block">
            <Input
              mainInput={"sm:w-full w-full"}
              icon={FaUnlock}
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                Enter correct password
              </p>
            )}
          </span>
          {error && (
            <p className="text-start text-red-500 text-xs pb-2">{error}</p>
          )}
          <p className=" text-xs mb-6 text-tn_pink text-end font-semibold">
            <Link to={"/forgot"}>Forgot Password? </Link>
          </p>
          <span className="flex flex-col sm:flex-row sm:space-x-2 mt-10 mb-2">
            <Button
              type="submit"
              className={`w-full ${
                isSigning ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isSigning} // Disable button while signing
            >
              {isSigning ? "Logging in..." : "Log in"}
            </Button>
            <span
              onClick={onClick}
              className={`bg-tn_dark_blue shadow-xl cursor-pointer transition duration-500 ease-in-out hover:opacity-80 mt-3 sm:mt-0 sm:p-0 p-2 text-sm sm:text-lg rounded-[100px] text-white flex items-center justify-center  w-full ${
                isSigningGoogle ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isSigningGoogle}
            >
              <FaGoogle size={18} className="mr-2" />{" "}
              {isSigningGoogle ? "Signing..." : "Sign-in with google"}
            </span>
          </span>
        </div>
      </form>
    </>
  );
}
