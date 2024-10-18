import React from "react";
import { FaArrowLeft, FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Custom Next Arrow with flexible styling
const NextArrow = ({ className, style, onClick }) => {
  return (
    <div className={`${className} text-white next-arr bg-tn_primary`} onClick={onClick}>
      <span>
        <FaArrowRight size={14} />
      </span>
    </div>
  );
};

// Custom Prev Arrow with flexible styling
const PrevArrow = ({ className, style, onClick }) => {
  return (
    <div className={`${className} text-white prev-arr bg-tn_primary`} onClick={onClick}>
      <span>
      <FaArrowLeft size={14} />

      </span>
    </div>
  );
};

export { NextArrow, PrevArrow };
