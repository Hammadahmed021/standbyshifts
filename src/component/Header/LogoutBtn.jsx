import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { signOut } from "../../service";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";

export default function LogoutBtn({className}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      await signOut(); // Call Firebase signOut function
      dispatch(logout()); // Dispatch your logout action
    } catch (error) {
      console.error("Logout failed:", error.message);
      // Handle logout failure if needed
    }
  };

  const handleYes = () => {
    console.log("Yes clicked");
    logoutHandler();
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className={`${className} block px-0 py-0 sm:px-4 sm:py-2 text-tn_dark hover:bg-gray-200 w-full text-start`}
        onClick={() => setIsModalOpen(true)}
      >
        Logout
      </button>
      {isModalOpen && (
        <Modal title="Are you sure?" onYes={handleYes} onClose={handleClose} />
      )}
    </>
  );
}
