import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "../component";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { signupUser } from "../store/authSlice";

export default function Signup() {
  const [isSigning, setIsSigning] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  // const [error, setError] = useState("");
  // const Login = async (data) => {
  //     setError("");
  //     try {
  //       const session = await authService.login(data);
  //       if (session) {
  //         const userData = await authService.getCurrentUser();
  //         if (userData) dispatch(authLogin(userData));
  //         navigate("/");
  //       }
  //     } catch (error) {
  //       console.log("unable to login", error);
  //     }
  //   };

  // const handleSignup = async (userData) => {
  //   setIsSigning(true);
  //   try {
  //     const response = await dispatch(signupUser(userData)).unwrap();
  //     console.log("Signup form response:", response);
  //   } catch (error) {
  //     console.error("API Signup failed:", error);
  //   }
  // };

  const handleSignup = async (userData) => {
    setIsSigning(true); 
    // const userData = { email, password, fname };

    try {
      const response = await dispatch(signupUser(userData)).unwrap();
      console.log("Signup response:", response);
      // navigate("/");
    } catch (error) {
      console.error("API Signup failed:", error.message);
      setIsSigning(false);
    }
  };

  const password = watch("password");

  return (
    <>
      <form onSubmit={handleSubmit(handleSignup)} className="mt-8">
        <div className="mt-2">
          <span className="mb-6 flex space-x-2">
            <Input
              mainInput={"sm:w-full w-full"}
              label="First Name"
              type="text"
              placeholder="John"
              {...register("fname", {
                required: false,
              })}
            />
            <Input
              mainInput={"sm:w-full w-full"}
              label="Last Name"
              type="text"
              placeholder="Doe"
              {...register("lname", {
                required: false,
              })}
            />
          </span>
          <span className="mb-6 flex space-x-2">
            <span className="w-full">
              <Input
                mainInput={"sm:w-full w-full"}
                label="Email"
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                  required: true,
                  validate: {
                    matchPatern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                        value
                      ) || "Email address must be a valid address",
                  },
                })}
              />

              {errors.email && (
                <p className="text-red-500 text-xs mt-1">Enter email address</p>
              )}
            </span>
            <span className="w-full">
              <Input
                mainInput={"sm:w-full w-full"}
                label="Phone Number"
                placeholder="8191 18181 17337"
                type="tel"
                {...register("phone", {
                  required: "Phone number is required",
                  validate: {
                    matchPattern: (value) =>
                      /^\+?[1-9]\d{1,14}$/.test(value) ||
                      "Phone number must be valid",
                  },
                })}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">Enter phone number</p>
              )}
            </span>
          </span>

          <span className="mb-6 block">
            <Input
              mainInput={"sm:w-full w-full"}
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">Please match password</p>
            )}
          </span>

          <span className="mb-6 block">
            <Input
              mainInput={"sm:w-full w-full"}
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Please match password</p>
            )}
          </span>

          <div className="form-control mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="mr-2"
                {...register("terms", { required: true })}
              />
              <p className="text-sm">
                I agree to all the Terms and Privacy Policies
              </p>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-xs mt-1">
                You must agree to the terms and privacy policies.
              </p>
            )}
          </div>

          <Button
            type="submit"
            className={`w-full ${
              isSigning ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSigning} // Disable button while signing
          >
            {isSigning ? "Registering user..." : "Sign in"}
          </Button>
        </div>
      </form>
    </>
  );
}
