import React from 'react';
import { FaStar } from "react-icons/fa";

const Ratings = ({ rating }) => {
  return (
    <div className="flex items-center">
      <FaStar size={12}/>
      <span className="text-sm text-black font-normal ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

export default Ratings;
