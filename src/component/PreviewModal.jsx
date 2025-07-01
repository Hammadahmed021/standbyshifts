import React, { useEffect } from "react";

const PreviewModal = ({ onClose, title = "Preview", children }) => {
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === "preview-modal-overlay") {
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
      id="preview-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2"
    >
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg relative p-4 sm:p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-3xl text-gray-600 hover:text-gray-800 font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold text-center mb-4">{title}</h2>

        <div className="flex justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;