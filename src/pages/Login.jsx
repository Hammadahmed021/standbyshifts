import React, { useEffect, useState } from "react";
import { Carousel, Login as LoginComponent } from "../component";
import { signup, login, Logo } from "../assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { SignUpWithGoogle } from "../service";
import { signupUser, login as loginFunc } from "../store/authSlice";
import { auth } from "../service/firebase";
import { getUserFromGmailLogin } from "../utils/Api";
import { Capacitor } from "@capacitor/core";
import BannerSlider from "../component/BannerSlider";
import { imageData } from "../utils/localDB";
import { showErrorToast, showSuccessToast } from "../utils/Toast";
import { getIdToken } from "firebase/auth";

// const images = [login, signup];

const Login = () => {
  const location = useLocation();
  const { type } = location.state || {}; // Get the type passed from Signup

  useEffect(() => {
    if (type) {
      localStorage.setItem("userType", type); // Save the type in localStorage
    }
  }, [type]);

  // Retrieve from state or localStorage if not present
  const userType = type || localStorage.getItem("userType");

  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  const [displayUserType, setDisplayUserType] = useState("");
  
    useEffect(() => {
      const changeUserTypeName = (type) => (type === "employer" ? "Business" : "Shift Seeker");
      setDisplayUserType(changeUserTypeName(userType));
    }, [userType]); // Re-run if userType changes

  const isApp =
    Capacitor.getPlatform() === "android" || Capacitor.getPlatform() === "ios";

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

  const handleSocialLogin = async () => {
    try {
      // Step 1: Sign in with Google
      const { user } = await SignUpWithGoogle();
      ////console.log("User logged in:", user);
  
      if (!user) {
        throw new Error("Google login failed. Please try again.");
      }
  
      // Step 2: Gather necessary data
      const ipAddress = await getUserIP();
      const token = await getIdToken(user);
      const email = user?.email;
  
      if (!email) {
        throw new Error("Failed to retrieve email from Google account.");
      }
  
      const payload = {
        email,
        type, // User type (employee/employer)
        userAgent,
        ipAddress,
        token,
      };
  
      // Step 3: Store temporary data locally
      localStorage.setItem("webToken", token);
      localStorage.setItem("userType", type);
  
      // Step 4: Check if the user exists or register them
      const response = await getUserFromGmailLogin(payload);
      if (response.status === 200) {
        showSuccessToast("Successfully logged in!");
  
        // Step 5: Dispatch login state to Redux
        dispatch(
          loginFunc({
            userData: {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photo: user.photoURL,
              userName: response?.data?.user?.name,
              userImage: response?.data?.userImage,
              loginType: user.providerData?.[0]?.providerId,
              type,
            },
          })
        );
  
        // Navigate to the home page
        navigate("/");
      } else {
        // If user doesn't exist or registration failed
        throw new Error(response.data?.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      // Clear sensitive data in case of an error
      localStorage.removeItem("webToken");
      localStorage.removeItem("userType");
  
      // Show error toast for user feedback
      showErrorToast(error.message || "An error occurred during login. Please try again.");
      
      // Log the error for debugging
      // console.error("Login failed:", error.message);
      ////console.log("Login failed:", error);
    }
  };
  
  return (
    <div className="flex sm:items-center justify-center overflow-hidden h-screen relative flex-col sm:flex-row items-start">
      <div className="flex w-full justify-between h-full sm:space-x-4">
        {/* Left Column */}
        <div className="w-full sm:w-1/2 relative hidden md:block min-h-screen ">
          <div className="bg-tn_pink mr-14 absolute z-0 left-0 right-0 top-0 bottom-0"></div>

          <div className="flex space-x-4  -ml-12">
            <BannerSlider images={imageData} slidesToShow={3} />
            <BannerSlider images={imageData} reverse={true} slidesToShow={3} />
            <BannerSlider images={imageData} slidesToShow={3} />
          </div>
        </div>
        <div className="w-full sm:w-1/2 px-0 sm:px-2">
          <div className="flex flex-col justify-start items-center w-full md:w-11/12 mx-auto h-full">
            <div className="flex items-center justify-between py-4 w-full mb-12">
              <Link to={"/"}>
                <img src={Logo} className="w-28 sm:w-32 md:w-40" />
              </Link>
              <p className="text-tn_pink text-base font-medium text-center underline">
                <Link className=" " to={"/signup"} state={{ type: userType }}>
                  Sign Up
                </Link>
              </p>
            </div>
            {/* Left Column: Login Form */}
            <div className="mb-6 w-full">
              <h2 className="text-3xl w-full text-black sm:text-4xl md:text-5xl font-semibold md:w-3/4 lg:w-2/4">
                Login as a {displayUserType}
              </h2>
              {/* <p className="text-tn_text_grey mt-2 mb-12">
                It is a long established fact that a reader
              </p> */}
              <LoginComponent onClick={handleSocialLogin} />
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

export default Login;
