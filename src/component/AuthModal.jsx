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
    <div id="modal-overlay" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4 sm:px-0">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <button onClick={onClose} className="text-2xl absolute top-1 right-2 font-bold text-gray-600 hover:text-gray-800">
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>

        {/* Render Employee and Employer buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => { onSelectRole('employee'); onClose(); }} // Pass 'employee' to onSelectRole
            className="px-4 py-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Employee
          </button>
          <button
            onClick={() => { onSelectRole('employer'); onClose(); }} // Pass 'employer' to onSelectRole
            className="px-4 py-2 w-full bg-green-500 text-white rounded hover:bg-green-600"
          >
            Employer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
