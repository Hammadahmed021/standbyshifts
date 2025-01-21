import React from "react";
import { FaStar } from "react-icons/fa";
import Ratings from "./Ratings"; // Assuming your Ratings component is in the same folder
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong, FaLocationDot } from "react-icons/fa6";
import { useSelector } from "react-redux";

const EmpCard = ({
  image,
  title,
  subheading,
  employer_name,
  location,
  isLocation = false,
  jobId,
}) => {
  const userData = useSelector((state) => state.auth.userData);
  const userType = userData?.user?.type || userData?.type;

  const navigate = useNavigate(); // Initialize navigate
  const handleCardClick = () => {
    if (userType == "employer") {
    navigate(`/employee-view/${jobId}`); // Navigate to job detail page with jobId
    } else{
    navigate(`/job/${jobId}`); // Navigate to job detail page with jobId

    }
  };

  return (
    <div className=" bg-white shadow-xl rounded-3xl overflow-hidden py-8 px-4">
      {/* Circular Image */}
      <div className="flex justify-center">
        <img
          src={image}
          alt={title}
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
        />
      </div>

      {/* Title */}
      <h2 className="text-[20px] font-semibold text-center text-tn_pink mt-4 truncate">
        {subheading || employer_name}
      </h2>

      {/* Subheading */}
      <p className="text-sm text-tn_text_grey text-center truncate">{title}</p>
      {isLocation && (
        <>
          <div className="mb-4 flex flex-wrap justify-center items-center mt-4">
            <h4 className="text-sm text-tag_blue  bg-tag_blue  bg-opacity-20  py-1 rounded-2xl flex justify-between items-center gap-2 px-2">
              <FaLocationDot />
              <span className="font-medium capitalize truncate">{location}</span>
            </h4>
          </div>
          <div className="text-center mt-6">
            <span
              className="cursor-pointer  hover:underline duration-200 transition-all flex items-center gap-4 justify-center"
              onClick={handleCardClick}
            >
              View profile
              <span>
                <FaArrowRightLong size={14} />
              </span>
            </span>
          </div>
        </>
      )}
      {isLocation !== true && (
        <div className="text-center mt-4">
          <span
            className="cursor-pointer border rounded-site px-4 py-2 hover:bg-tn_primary duration-200 transition-all hover:text-white"
            onClick={handleCardClick}
          >
            View profile
          </span>
        </div>
      )}
    </div>
  );
};

export default EmpCard;
