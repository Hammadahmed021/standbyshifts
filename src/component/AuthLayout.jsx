import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthLayout = ({ children, authentication = true }) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    const redirectState = JSON.parse(localStorage.getItem("redirectState"));

    if (authentication && !authStatus) {
      // If authentication is required and user is not logged in, redirect to login
      navigate("/login");
    } else if (!authentication && authStatus) {
      // If authentication is not required and user is logged in, redirect to home
      navigate("/profile");
    } else if (redirectState && redirectState.fromReservation && authStatus) {
      // If redirected from reservation and user is logged in, navigate back to reservation
      localStorage.removeItem("redirectState");
      navigate(redirectState.location.pathname, { state: redirectState.location.state });
    }
    
    setLoader(false);
  }, [authentication, authStatus, navigate]);

  return loader ? <h2>Loading...</h2> : <>{children}</>;
};

export default AuthLayout;
