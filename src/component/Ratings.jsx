import React from 'react';
import { FaStar } from "react-icons/fa";

const Ratings = ({ rating }) => {
  // Ensure rating is a number and default to 0 if it's undefined or not a number
  const formattedRating = typeof rating === 'number' ? rating.toFixed(2) : '0.00';

  return (
    <div className="flex items-center">
      <FaStar size={12} color='#F59200'/>
      <span className="text-sm text-black font-normal ml-1">{formattedRating}</span>
    </div>
  );
};

export default Ratings;
