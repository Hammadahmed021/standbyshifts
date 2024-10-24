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
  const [loading, setLoading] = useState(true); // Add loading state
  const dispatch = useDispatch();

  const isApp = Capacitor.isNativePlatform();

  const userId = currentUser?.id || userData?.user?.id;

  // Set up StatusBar for both iOS and Android
  // useEffect(() => {
  //   const setupStatusBar = async () => {
  //     if (isApp) {
  //       // iOS specific: Handle status bar tap event
  //       if (Capacitor.getPlatform() === "ios") {
  //         window.addEventListener("statusTap", () => {
  //           console.log("Status bar tapped");
  //           // Optionally scroll to top on status bar tap
  //           window.scrollTo({ top: 0, behavior: "smooth" });
  //         });
  //         await StatusBar.setStyle({ style: Style.Light }); // Set iOS status bar style to light
  //       }

  //       // Android specific: Set transparent status bar
  //       if (Capacitor.getPlatform() === "android") {
  //         await StatusBar.setOverlaysWebView({ overlay: true }); // Display content under the status bar
  //         await StatusBar.setStyle({ style: Style.Dark }); // Set Android status bar style to dark
  //       }

  //       // Show the status bar for both platforms by default
  //       await StatusBar.show();
  //     }
  //   };

  //   setupStatusBar();
  // }, [isApp]);

  // Back button listener for both iOS and Android
  useEffect(() => {
    if (isApp) {
      const backButtonListener = CapacitorApp.addListener(
        "backButton",
        ({ canGoBack }) => {
          if (Capacitor.getPlatform() === "android") {
            // Android behavior: navigate back or exit app if no more history
            if (!canGoBack) {
              CapacitorApp.exitApp(); // Exit the app if no page to go back to
            } else {
              window.history.back(); // Navigate back if possible
            }
          } else if (Capacitor.getPlatform() === "ios") {
            // iOS behavior: navigate back with history
            if (canGoBack) {
              window.history.back(); // iOS doesn't need exit, just handle navigation
            }
          }
        }
      );

      return () => {
        backButtonListener.remove(); // Cleanup listener on unmount
      };
    }
  }, [isApp]);

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
      const userAgent = navigator.userAgent;
      const ipAddress = await getUserIP();

      const payload = {
        userAgent,
        ipAddress,
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
  }, [navigate]);

  // useEffect(() => {
  //   // Request permission to use push notifications
  //   const initializePushNotifications = async () => {
  //     try {
  //       const result = await PushNotifications.requestPermissions();
  //       if (result.receive === "granted") {
  //         console.log("Push notifications permission granted");
  //         await PushNotifications.register();

  //         PushNotifications.addListener("registration", (token) => {
  //           console.log(
  //             "Device registered for push notifications, token:",
  //             token.value
  //           );
  //           // Send the token to your server
  //         });

  //         PushNotifications.addListener(
  //           "pushNotificationReceived",
  //           (notification) => {
  //             console.log("Push notification received:", notification);
  //             // Show a local notification or update app state
  //             console.log("Push notification received:", notification);

  //             // Dispatch the notification to Redux, or handle state
  //             dispatch(setNotification(notification.body));
  //           }
  //         );

  //         PushNotifications.addListener(
  //           "pushNotificationActionPerformed",
  //           (notification) => {
  //             console.log("Push notification action performed:", notification);
  //             // Handle notification action
  //           }
  //         );
  //       } else {
  //         console.log("Push notifications permission denied");
  //       }
  //     } catch (err) {
  //       console.error("Error initializing push notifications:", err);
  //     }
  //   };

  //   initializePushNotifications();
  // }, []);

  useEffect(() => {
    if (userId) {
      initializeSocket(userId, dispatch);
    } else {
      cleanupSocket();
    }

    return () => {
      cleanupSocket();
    };
  }, [userId, dispatch]);

  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(
    location.pathname
  );

  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        {!shouldHideHeaderFooter && <Header />}

        {/* Main Content Area */}
        <main className="flex-grow relative">
          {loading ? <Loader /> : <Outlet />}
        </main>

        {/* Footer */}
        {!shouldHideHeaderFooter && <Footer />}
      </div>

      <NotificationModal />
    </>
  );
}

export default App;
