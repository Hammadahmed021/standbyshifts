import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import {
  Home,
  About,
  Login,
  RestaurantDetail,
  Partner,
  PrivacyPolicy,
  TradingCondition,
  Press,
  FAQs,
  Contact,
  Listing,
  RestaurantReservation,
  Signup,
  // Profile,
  Thankyou,
  NotFound,
  ForgotPassword,
  HomeNew,
  Employer,
  Employee,
  EmployeeProfile,
  EmployerProfile,
  PostJob,
  EmployerProfileView,
  EmployeeProfileView,
  JobDetail,
  AllJobs,
  CompanyProfile,
} from "../pages";
import { AuthLayout } from "../component";

// Determine base path based on environment
const baseURL = import.meta.env.MODE === 'production'
  ? import.meta.env.VITE_BASE_URL_PRODUCTION
  : import.meta.env.VITE_BASE_URL_LOCAL;

function BaseRouter() {
  return (
    <BrowserRouter basename={baseURL}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomeNew />} />
          <Route path="login" element={<AuthLayout authentication={false}><Login /></AuthLayout>} />
          <Route path="forgot" element={<AuthLayout authentication={false}><ForgotPassword /></AuthLayout>} />
          <Route path="signup" element={<AuthLayout authentication={false}><Signup /></AuthLayout>} />
          <Route path="employer" element={<AuthLayout authentication={true}><Employer /></AuthLayout>} />
          <Route path="employee" element={<AuthLayout authentication={true}><Employee /></AuthLayout>} />
          <Route path="about" element={<About />} />
          <Route path="restaurant/:id" element={<RestaurantDetail />} />
          <Route path="partner" element={<Partner />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-service" element={<TradingCondition />} />
          <Route path="press" element={<Press />} />
          <Route path="faq" element={<FAQs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="listing" element={<Listing />} />
          <Route path="thankyou" element={<Thankyou />} />
          <Route path="reservation/:id" element={<RestaurantReservation />} />
          <Route path="job/:id" element={<JobDetail />} />
          <Route path="jobs" element={<AllJobs />} />
          <Route path="employee-profile" element={<AuthLayout authentication={true}><EmployeeProfile /></AuthLayout>} />
          <Route path="company/:companyId" element={<AuthLayout authentication={true}><CompanyProfile /></AuthLayout>} />
          <Route path="employer-profile" element={<AuthLayout authentication={true}><EmployerProfile /></AuthLayout>} />
          <Route path="employer-profile-view" element={<AuthLayout authentication={true}><EmployerProfileView /></AuthLayout>} />
          <Route path="employee-profile-view" element={<AuthLayout authentication={true}><EmployeeProfileView  /></AuthLayout>} />
          <Route path="post-job" element={<AuthLayout authentication={true}><PostJob /></AuthLayout>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default BaseRouter;
