import React, { useEffect } from 'react';

const AuthModal = ({ title, onSelectRole, onClose }) => {
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === 'modal-overlay') {
        onClose();
      }
    };

    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div id="modal-overlay" className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50 px-4 sm:px-0 bg-blend-saturation">
      <div className="bg-white rounded-3xl shadow-xl p-6 w-auto relative md:p-12 drop-shadow-2xl bg-opacity-95">
        <button onClick={onClose} className="text-2xl absolute top-1 right-2 font-bold text-gray-600 hover:text-gray-800">
          &times;
        </button>
        <h2 className="text-2xl sm:text-5xl font-semibold mb-4 text-center">{title}</h2>
        <p>It is a long established fact that a reader will be distracted.</p>


        {/* Render Employee and Employer buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => { onSelectRole('employee'); onClose(); }} // Pass 'employee' to onSelectRole
            className="px-4 py-3 w-full bg-tn_pink text-white rounded-2xl hover:opacity-80"
          >
            Employee
          </button>
          <button
            onClick={() => { onSelectRole('employer'); onClose(); }} // Pass 'employer' to onSelectRole
            className="px-4 py-3 w-full border border-tn_primary text-tn_primary hover:text-white rounded-2xl  hover:bg-tn_primary"
          >
            Employer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
