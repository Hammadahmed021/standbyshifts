import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthLayout = ({ children, authentication = true }) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);
  const authType = useSelector((state) => state.auth.userData?.user?.type);
  const userType = localStorage.getItem("userType"); // Fetch user type
  const user = userType || authType

  useEffect(() => {
    const redirectState = JSON.parse(localStorage.getItem("redirectState"));

    if (authentication && !authStatus) {
      navigate("/"); // Redirect to login if not authenticated
    } else if (!authentication && authStatus) {
      // Redirect based on user type
      if (user === "employee") {
        navigate("/employee"); // Redirect to employee page
      } else if (user === "employer") {
        navigate("/employer-profile"); // Redirect to employer page
      } else {
        navigate("/"); // Fallback
        localStorage.removeItem("userType")
      }
    } else if (redirectState && redirectState.fromReservation && authStatus) {
      // Handle redirection from reservation
      localStorage.removeItem("redirectState");
      navigate(redirectState.location.pathname, { state: redirectState.location.state });
    }
    
    setLoader(false);
  }, [authentication, authStatus, navigate, user]);

  return loader ? <h2>Loading...</h2> : <>{children}</>;
};

export default AuthLayout;
