import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "../component";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/authSlice";

export default function ForgotPassForm() {
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  const LoginSubmit = async (data) => {
    setIsSigning(true); // Assuming you have setIsSigning state
    try {
      const loginResponse = await dispatch(loginUser(data)).unwrap();
      console.log("Login Response:", loginResponse);
      // Handle success, navigate user or update UI
    } catch (error) {
      console.error("Login failed:", error);
      if (error == "auth/wrong-password") {
        setError("Password is wrong");
      } else if (error == "auth/user-not-found") {
        setError("User does not exist");
      } else {
        setError("Login failed. Please try again."); // Generic error message
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
        <div className="space-y-2">
          <span className="mb-6 block">
            <Input
              mainInput={"sm:w-full w-full"}
              label="Email"
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
        
          {error && (
            <p className="text-start text-red-500 text-sm pb-2">{error}</p>
          )}
          <Button
            type="submit"
            className={`w-full ${
              isSigning ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSigning} // Disable button while signing
          >
            {isSigning ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </>
  );
}
