import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Home, About, Login, RestuarantDetail, Partner, PrivacyPolicy, TradingCondition, Press, FAQs, Contact, Listing, RestaurantReservation, Signup, Profile } from "../pages";
import { AuthLayout } from "../component";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/restaurant/:id",
        element: <RestuarantDetail />,
      },
      {
        path: "/partner",
        element: <Partner />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-of-service",
        element: <TradingCondition />,
      },
      {
        path: "/press",
        element: <Press />,
      },
      {
        path: "/faq",
        element: <FAQs />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/listing",
        element: <Listing />,
      },
      {
        path: "/reservation/:id",
        element: <RestaurantReservation />,
      },
      {
        path: "/profile",
        element: (
          <AuthLayout authentication={true}>
            <Profile />
          </AuthLayout>
        ),
      },
    ],
  },
]);

export default router;
