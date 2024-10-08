import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

const AnimatedCounter = ({
  icon: Icon,
  heading,
  targetNumber,
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const increment = targetNumber / (duration / 100); // Calculate how much to increment every 100 ms
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount < targetNumber) {
          return Math.min(prevCount + increment, targetNumber); // Increment until the target number is reached
        } else {
          clearInterval(interval); // Clear the interval once the target is reached
          return prevCount;
        }
      });
    }, 100);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [targetNumber, duration]);

  return (
    <div className="flex flex-col items-center  text-center">
      <div className="flex space-x-2 items-center">
        {/* Counter Section */}
   
          {/* Icon on the Left */}
          <Icon className="text-white" size={34}  />
       
        {/* Number Display */}
        <span className="text-4xl font-bold text-white">{Math.floor(count)}</span>

        {/* Plus Icon */}
        <FaPlus size={22} className="text-white" />
      </div>
      <h4 className="text-sm font-light text-white leading-none mt-1">{heading}</h4>
    </div>
  );
};

export default AnimatedCounter;
