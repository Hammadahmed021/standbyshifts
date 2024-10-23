import React from "react";
import { FaStar } from "react-icons/fa";
import Ratings from "./Ratings"; // Assuming your Ratings component is in the same folder

const EmpCard = ({ image, title, subheading, rating }) => {
  return (
    <div className=" bg-white shadow-xl rounded-3xl overflow-hidden py-10 px-8">
      {/* Circular Image */}
      <div className="flex justify-center"> 
        <img
          src={image}
          alt={title}
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
        />
      </div>

      {/* Title */}
      <h2 className="text-[20px] font-semibold text-center text-tn_pink mt-6">{title}</h2>

      {/* Subheading */}
      <p className="text-sm text-tn_text_grey text-center">{subheading}</p>

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
