// src/App.js
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header, Footer, ScrollToTop } from './component';
import { useDispatch, useSelector } from 'react-redux';
import { initializeSocket, cleanupSocket } from '../socket'; // Adjust import path
import { verifyUser } from './utils/Api';
import NotificationModal from './component/NotificationModal';

function App() {
  const location = useLocation();
  const hideHeaderFooterRoutes = ["/login", "/signup", "/forgot"];
  const userData = useSelector((state) => state.auth.userData);
  const [currentUser, setCurrentUser] = useState({});

  const userId = currentUser?.id || userData?.user?.id;
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await verifyUser();
        const data = await response.data;
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

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

  return (
    <>
      <ScrollToTop />
      {!shouldHideHeaderFooter && <Header />}
      <main className="relative">
        <Outlet />
      </main>
      {!shouldHideHeaderFooter && <Footer />}
      <NotificationModal />
    </>
  );
}

export default App;
