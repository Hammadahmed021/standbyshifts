import React, { useEffect } from "react";

const LoginSignupModal = ({ role, onAction, onClose }) => {
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === "modal-overlay") {
        onClose();
      }
    };

    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50 px-4 sm:px-0 bg-blend-saturation"
    >
      <div className="bg-white rounded-3xl shadow-xl p-6 w-auto relative md:p-12 drop-shadow-2xl bg-opacity-95">
        <button
          onClick={onClose}
          className="text-2xl absolute top-1 right-2 font-bold text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
        <h2 className="text-2xl sm:text-5xl font-semibold mb-4 text-center">
          {`Continue as ${role === "employee" ? "Employee" : "Employer"}`}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Please log in or sign up to proceed.
        </p>

        {/* Render Login and Signup buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => onAction("login")}
            className="px-4 py-3 w-full bg-tn_pink text-white rounded-2xl hover:opacity-80"
          >
            Login
          </button>
          <button
            onClick={() => onAction("signup")}
            className="px-4 py-3 w-full border border-tn_primary text-tn_primary hover:text-white rounded-2xl hover:bg-tn_primary"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupModal;
