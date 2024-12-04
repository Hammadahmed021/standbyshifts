import React, { useState, useEffect } from "react";
import { ToggleAvailablity } from "../utils/Api";
import { showSuccessToast } from "../utils/Toast";

const ToggleAvailability = ({ is_available }) => {
  const [isAvailable, setIsAvailable] = useState(is_available); // Use prop as initial state

  // Synchronize state with prop when it changes
  useEffect(() => {
    setIsAvailable(is_available);
  }, [is_available]);

  const toggleAvailability = async () => {
    try {
      const response = await ToggleAvailablity(); // API call to toggle availability
      if (response) {
        setIsAvailable((prev) => !prev); // Toggle the local state
        showSuccessToast(response.message); // Show a success message
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="font-medium text-xs">
        {isAvailable ? "Open to work" : "Unavailable"}
      </span>
      <div
        onClick={toggleAvailability}
        className={`relative inline-flex items-center cursor-pointer w-12 h-6 rounded-full transition ${
          isAvailable ? "bg-green-500" : "bg-gray-400"
        }`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full shadow transition-transform ${
            isAvailable ? "translate-x-7" : "translate-x-1"
          }`}
        ></span>
      </div>
    </div>
  );
};

export default ToggleAvailability;
