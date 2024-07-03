import React from "react";
import { useSelector } from "react-redux";
import { fallback } from "../assets";

export default function Profile() {
  const userData = useSelector((state) => state.auth.userData);
  return (
    <>
      <div className="container mx-auto p-4">
        <img
          src={userData?.photoURL || fallback}
          alt="user profile"
          className="w-16 h-16 rounded-full"
        />
        <p className="text-3xl font-extrabold text-tn_dark mt-4">
          Welcome {userData?.displayName}
        </p>
        <p className="mt-1 text-base text-tn_dark mb-0">{userData?.email}</p>
      </div>
      <div className="container mx-auto p-4">
        <p className="text-3xl font-extrabold text-tn_dark mt-4">
          Your Booking History
        </p>
        <p className="mt-1 text-base text-tn_dark mb-0">
          Check your past and upcoming reservations easily by viewing your
          reservation history here.
        </p>
      </div>
    </>
  );
}
