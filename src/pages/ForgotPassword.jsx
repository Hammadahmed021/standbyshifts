import React, { useState } from "react";
import { ForgotPassForm, Login as LoginComponent } from "../component";
import { login, Logo } from "../assets";
import { Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";

import { Capacitor } from "@capacitor/core";

// const images = [login, signup];

const ForgotPassword = () => {
  const [error, setError] = useState("");

  const isApp = Capacitor.isNativePlatform();

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-2 relative">
      <Link to={"/"}>
        <img
          src={Logo}
          // className={` ${
          //   isApp
          //     ? "w-fit absolute top-8 left-4"
          //     : "w-fit absolute top-4 left-4"
          // }`}
           className={`h-auto max-w-[120px] sm:max-w-[160px] ${
            isApp
              ? "absolute top-8 left-4"
              : "absolute top-4 left-4"
          }`}
        />
      </Link>
      <div className="grid grid-cols-1 gap-2 items-center">
        {/* Left Column: Login Form */}
        <div className="px-2 md:px-4">
          <p className="mb-6 flex items-center">
            <FaChevronLeft size={16} className="mr-1" />{" "}
            <Link to={"/login"}>Back to Login</Link>
          </p>
          <h2 className="text-3xl w-full text-black sm:text-4xl md:text-5xl font-extrabold">
            Forgot your password?
          </h2>
          <p className="text-tn_text_grey mt-2 mb-8 w-full sm:w-[90%]">
            Don’t worry, happens to all of us. Enter your email below to recover
            your password
          </p>
          <ForgotPassForm />

          {error && <p className="mt-3 text-center text-base">{error}</p>}
        </div>

        {/* Right Column: Image Slider */}
        {/* <div className="relative hidden md:block">
          <img src={login} alt={`login`} className="w-full" />
        </div> */}
      </div>
    </div>
  );
};

export default ForgotPassword;
