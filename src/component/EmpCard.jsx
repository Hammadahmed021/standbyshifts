import React from "react";
import { FaStar } from "react-icons/fa";
import Ratings from "./Ratings"; // Assuming your Ratings component is in the same folder
import { useNavigate } from "react-router-dom";

const EmpCard = ({ image, title, subheading, employer_name, rating }) => {
  const navigate = useNavigate(); // Initialize navigate
  const handleCardClick = () => {
    navigate(`/job/${jobId}`); // Navigate to job detail page with jobId
  };

  return (
    <div
      className=" bg-white shadow-xl rounded-3xl overflow-hidden py-8 px-4"
      onClick={handleCardClick}
    >
      {/* Circular Image */}
      <div className="flex justify-center">
        <img
          src={image}
          alt={title}
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
        />
      </div>

      {/* Title */}
      <h2 className="text-[20px] font-semibold text-center text-tn_pink mt-6 truncate">
        {title}
      </h2>

      {/* Subheading */}
      <p className="text-sm text-tn_text_grey text-center truncate">
        {subheading || employer_name}
      </p>

      {/* Rating */}
      {rating && (
        <div className="flex justify-center mt-2">
          <Ratings rating={rating} />
        </div>
      )}
    </div>
  );
};

export default EmpCard;
