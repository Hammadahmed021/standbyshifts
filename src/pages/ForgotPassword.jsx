import React, { useState } from "react";
import { Carousel, ForgotPassForm, Login as LoginComponent } from "../component";
import { signup, login, Logo } from "../assets";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle, FaApple, FaBackward, FaChevronLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { SignUpWithGoogle } from "../service";
import { signupUser, login as loginFunc } from "../store/authSlice";
import { auth } from "../service/firebase";

// const images = [login, signup];

const ForgotPassword = () => {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  const handleLogin = async () => {
    try {
      const { user } = await SignUpWithGoogle();
      console.log("User logged in:", user.displayName);

      // Check if the user is already logged in
      // const currentUser = auth.currentUser;
      // if (currentUser && currentUser.uid === user.uid) {
      //   setError("User is already logged in.");

      //   setTimeout(() => navigate("/"), 2000);
      //   console.log(authStatus, userData, "data");
      //   return; // Stop further execution
      // }

      // Proceed with login if it's a different user or not logged in
      if (user) {
        dispatch(
          loginFunc({
            userData: {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photo: user.photoURL,
            },
          })
        );
        // navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-2 relative">
      <Link to={"/"}>
        <img src={Logo} className="w-fit absolute top-4 left-4" />
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Login Form */}
        <div className="px-4">
          <p className="mb-6 flex items-center">
           <FaChevronLeft size={16} className="mr-1"/> <Link to={"/login"}>Back to Login</Link>
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
        <div className="relative hidden md:block">
          <img src={login} alt={`login`} className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
