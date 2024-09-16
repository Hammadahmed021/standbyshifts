import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header, Footer, ScrollToTop, Loader } from "./component";
import { useDispatch, useSelector } from "react-redux";
import { initializeSocket, cleanupSocket } from "../socket"; // Adjust import path
import { verifyUser } from "./utils/Api";
import NotificationModal from "./component/NotificationModal";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from '@capacitor/status-bar'; // Import StatusBar from Capacitor
import { App as CapacitorApp } from "@capacitor/app";
import { logout } from "./store/authSlice";
import { PushNotifications } from '@capacitor/push-notifications';

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
  useEffect(() => {
    const setupStatusBar = async () => {
      if (isApp) {
        // iOS specific: Handle status bar tap event
        if (Capacitor.getPlatform() === 'ios') {
          window.addEventListener('statusTap', () => {
            console.log('Status bar tapped');
            // Optionally scroll to top on status bar tap
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
          await StatusBar.setStyle({ style: Style.Light }); // Set iOS status bar style to light
        }

        // Android specific: Set transparent status bar
        if (Capacitor.getPlatform() === 'android') {
          await StatusBar.setOverlaysWebView({ overlay: true }); // Display content under the status bar
          await StatusBar.setStyle({ style: Style.Dark }); // Set Android status bar style to dark
        }

        // Show the status bar for both platforms by default
        await StatusBar.show();
      }
    };

    setupStatusBar();
  }, [isApp]);

  // Back button listener for both iOS and Android
  useEffect(() => {
    if (isApp) {
      const backButtonListener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (Capacitor.getPlatform() === 'android') {
          // Android behavior: navigate back or exit app if no more history
          if (!canGoBack) {
            CapacitorApp.exitApp(); // Exit the app if no page to go back to
          } else {
            window.history.back(); // Navigate back if possible
          }
        } else if (Capacitor.getPlatform() === 'ios') {
          // iOS behavior: navigate back with history
          if (canGoBack) {
            window.history.back(); // iOS doesn't need exit, just handle navigation
          }
        }
      });

      return () => {
        backButtonListener.remove(); // Cleanup listener on unmount
      };
    }
  }, [isApp]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await verifyUser();
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

  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(location.pathname);
  useEffect(() => {
    // Request permission to use push notifications
    PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
            // Register with FCM
            PushNotifications.register();
        } else {
            console.log('Push notifications permission denied');
        }
    });

    // Handle background notifications
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
    });

    // Handle foreground notifications
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed:', notification);
    });
}, []);

  return (
    <>
      <ScrollToTop />
      {!shouldHideHeaderFooter && <Header style={{ paddingTop: isApp ? '20px' : '0' }} />}
      <main className="relative">
        {loading ? <Loader /> : <Outlet />}
      </main>
      {!shouldHideHeaderFooter && <Footer />}
      <NotificationModal />
    </>
  );
}

export default App;
