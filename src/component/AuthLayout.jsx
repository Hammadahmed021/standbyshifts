import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthLayout = ({ children, authentication = true }) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (authentication && !authStatus) {
      // If authentication is required and user is not logged in, redirect to login
      navigate("/login");
    } else if (!authentication && authStatus) {
      // If authentication is not required and user is logged in, redirect to home
      navigate("/profile");
    }
    setLoader(false);
  }, [authentication, authStatus, navigate]);
  
  return loader ? <h2>Loading...</h2> : <>{children}</>;
};

export default AuthLayout;
