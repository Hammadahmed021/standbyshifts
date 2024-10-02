import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthLayout = ({ children, authentication = true }) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);
  const userType = localStorage.getItem("userType"); // Fetch user type

  useEffect(() => {
    const redirectState = JSON.parse(localStorage.getItem("redirectState"));

    if (authentication && !authStatus) {
      navigate("/"); // Redirect to login if not authenticated
    } else if (!authentication && authStatus) {
      // Redirect based on user type
      if (userType === "employee") {
        navigate("/employee"); // Redirect to employee page
      } else if (userType === "employer") {
        navigate("/employer"); // Redirect to employer page
      } else {
        navigate("/profile"); // Fallback
      }
    } else if (redirectState && redirectState.fromReservation && authStatus) {
      // Handle redirection from reservation
      localStorage.removeItem("redirectState");
      navigate(redirectState.location.pathname, { state: redirectState.location.state });
    }
    
    setLoader(false);
  }, [authentication, authStatus, navigate, userType]);

  return loader ? <h2>Loading...</h2> : <>{children}</>;
};

export default AuthLayout;
