import React, { useEffect, useState } from "react";
import { Signup as SignupComponent } from "../component";
import { signup, login, Logo } from "../assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { signupUser, login as loginFunc } from "../store/authSlice";
import { SignUpWithGoogle } from "../service";
import { auth } from "../service/firebase";
import { getUserFromGmailSignup } from "../utils/Api";
import { Capacitor } from "@capacitor/core";
import BannerSlider from "../component/BannerSlider";
import { imageData } from "../utils/localDB";

const Signup = () => {
  const location = useLocation();
  const { type } = location.state || {}; // Get the type passed from the homepage

  useEffect(() => {
    if (type) {
      localStorage.setItem("userType", type); // Save the type in localStorage
    }
  }, [type]);

  // If the type is not available in state, get it from localStorage
  const userType = type || localStorage.getItem("userType");

  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isApp = Capacitor.isNativePlatform();

  const handleGoogleSignup = async () => {
    try {
      const { user } = await SignUpWithGoogle();
      console.log("User logged in:", user.displayName);

      // Proceed with login if it's a different user or not logged in
      const userData = {
        name: user?.displayName,
        email: user?.email,
      };

      if (userData) {
        const response = await getUserFromGmailSignup(userData);
        const token = response.data.token;

        // Store token in localStorage
        localStorage.setItem("webToken", token);
      }

      if (user) {
        dispatch(
          loginFunc({
            userData: {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              password: user.password,
              loginType: user.providerData?.[0]?.providerId,
            },
          })
        );
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="flex sm:items-center justify-center min-h-screen relative flex-col sm:flex-row items-start">
      <div className="flex w-full justify-between min-h-screen space-x-4">
        {/* Left Column */}
        <div className="w-full sm:w-1/2 relative hidden md:block min-h-screen">
          <div className="bg-tn_pink mr-14 absolute z-0 left-0 right-0 top-0 bottom-0"></div>

          <div className="flex space-x-4  -ml-12">
            <BannerSlider images={imageData} slidesToShow={3} />
            <BannerSlider images={imageData} reverse={true} slidesToShow={3} />
            <BannerSlider images={imageData} slidesToShow={3} />
          </div>
        </div>
        <div className="w-full sm:w-1/2">
          <div className="flex flex-col justify-start items-center w-full md:w-11/12 mx-auto h-full">
            <div className="flex items-center justify-between py-4 w-full mb-12">
              <Link to={"/"}>
                <img src={Logo} className="" />
              </Link>
              <p className="text-tn_pink text-base font-medium text-center underline">
                <Link className=" " to={"/login"} state={{ type: userType }}>
                  Log In
                </Link>
              </p>
            </div>
            {/* Left Column: Login Form */}
            <div className="mb-6 w-full">
              <h2 className="text-3xl w-full text-black sm:text-4xl md:text-5xl font-semibold md:w-2/4">
                Sign-up as an {userType}
              </h2>
              <p className="text-tn_text_grey mt-2 mb-12">
                It is a long established fact that a reader
              </p>
              <SignupComponent onClick={handleGoogleSignup} />
              {/* <span
                className="p-3 flex justify-center text-center border w-full border-tn_light_grey rounded-lg"
                onClick={handleGoogleSignup}
              >
                <FaGoogle size={24} />
              </span> */}
              {/* {error && <p className="mt-3 text-center text-base">{error}</p>} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
