import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header, Footer, ScrollToTop, Loader } from "./component";
import { useDispatch, useSelector } from "react-redux";
import { initializeSocket, cleanupSocket } from "../socket"; // Adjust import path
import { verifyUser } from "./utils/Api";
import NotificationModal from "./component/NotificationModal";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar"; // Import StatusBar from Capacitor
import { App as CapacitorApp } from "@capacitor/app";
import { logout } from "./store/authSlice";
import { PushNotifications } from "@capacitor/push-notifications";
import { setNotification } from "./store/notificationSlice";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideHeaderFooterRoutes = ["/login", "/signup", "/forgot"];
  const userData = useSelector((state) => state.auth.userData);
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

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

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("webToken");
      const userAgent = navigator.userAgent;
      const ipAddress = await getUserIP();

      const payload = {
        userAgent,
        ipAddress,
        token,
      };

      try {
        const response = await verifyUser(payload);
        if (response.status === 200) {
          const data = await response.data;
          setCurrentUser(data);
        } else {
          // If unauthorized, clear user data and redirect to login
          setCurrentUser({});
          dispatch(logout());
          localStorage.removeItem("webToken");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setCurrentUser({});
        dispatch(logout());
        localStorage.removeItem("webToken");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, dispatch]);


  useEffect(() => {
    // Redirect logic when the user visits the base URL
    if (location.pathname === "/" && (userData?.user?.type || userData?.type)) {
      if ((userData?.user?.type || userData?.type) === "employee") {
        navigate("/employee");
      } else if ((userData?.user?.type || userData?.type) === "employer") {
        navigate("/employer");
      }
    }
  }, [location.pathname, navigate, userData]);

  // ////console.log(location.pathname, userData, 'location.pathname');


  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(
    location.pathname
  );

  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        {!shouldHideHeaderFooter && <Header />}
        <main className="flex-grow relative px-3 sm:px-0">
          {loading ? <div className="min-h-screen flex items-center justify-center"><Loader /> </div> : <Outlet />}
        </main>
        {!shouldHideHeaderFooter && <Footer />}
      </div>
    </>
  );
}

export default App;
