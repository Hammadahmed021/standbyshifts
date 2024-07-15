import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "../component";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/authSlice";

export default function Login() {
  const [isSigning, setIsSigning] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
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

  const LoginSubmit = async (data) => {
    // let { email, password } = data
    try {
      const loginResponse = await dispatch(loginUser(data)).unwrap();
      console.log("Login Response:", loginResponse);
      // Handle success, navigate user or update UI
    } catch (error) {
      console.error("Login failed:", error);
      // Handle error, show error message or retry
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
              <p className="text-red-500 text-xs mt-1">
                Enter corrent password
              </p>
            )}
          </span>
          <Button
            type="submit"
            className={`w-full ${
              isSigning ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSigning} // Disable button while signing
          >
            {isSigning ? "Logging in..." : "Log in"}
          </Button>
        </div>
      </form>
    </>
  );
}
