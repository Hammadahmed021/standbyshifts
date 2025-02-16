import React from "react";
import {
  FaCalendar,
  FaChevronRight,
  FaClock,
  FaCrown,
  FaMapMarker,
  FaPen,
} from "react-icons/fa";
import { FaArrowRightLong, FaPencil } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { fallback } from "../assets";

// Skeleton Loader Component
const JobCardSkeleton = () => (
  <div className="w-full rounded-2xl shadow-md bg-white p-6 animate-pulse">
    {/* Skeleton Header */}
    <div className="flex items-center mb-4">
      <div className="w-16 h-16 bg-gray-300 rounded-lg mr-4"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-300 rounded-md w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
      </div>
    </div>

    {/* Skeleton Date and Time */}
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="h-5 bg-gray-300 rounded-full w-20"></div>
      <div className="h-5 bg-gray-300 rounded-full w-20"></div>
    </div>

    {/* Skeleton Level and Location */}
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="h-5 bg-gray-300 rounded-full w-16"></div>
      <div className="h-5 bg-gray-300 rounded-full w-16"></div>
    </div>

    {/* Skeleton Description */}
    <div className="h-4 bg-gray-300 rounded-md w-full mb-4"></div>
    <div className="h-4 bg-gray-300 rounded-md w-5/6 mb-4"></div>

    {/* Skeleton Button */}
    <div className="h-10 bg-gray-300 rounded-full w-full"></div>
  </div>
);

const JobCard = ({
  companyLogo,
  jobTitle,
  companyName,
  payRate,
  dateRange,
  timeRange,
  level,
  address,
  description,
  jobId,
  applicants, // Add applicants prop
  loading,
  userType,
  onClick, // Add prop to show applicants
  className,
  btnText,
  onClickToEdit,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle navigation
  const handleApplyClick = () => {
    navigate(`/job/${jobId}`); // Assuming job detail page is at '/job/:id'
  };
  const isEmployeeView = location.pathname.startsWith("/employee-view");
  const isEmployer = location.pathname.startsWith("/appliers-on-job");
  console.log(isEmployeeView, "isEmployeeView >>>>>>>");

  // Determine button text based on applicants
  const buttonText = applicants?.length > 0 ? "View Shift" : "Apply";

  if (loading) {
    return <JobCardSkeleton />;
  }

  return (
    <div
      className={`w-full rounded-2xl bg-white p-6 mb-6 flex flex-col h-full ${className}`}
    >
      {/* Header */}
      <div className="flex items-center mb-4 relative">
        <img
          src={companyLogo || fallback}
          alt={companyName}
          className="w-16 h-16 object-cover mr-4 rounded-lg shadow-md bg-slate-400"
        />
        <div>
          <h2 className="text-base sm:text-xl font-semibold text-tn_dark_field">
            {jobTitle}
          </h2>
          <div className="flex flex-wrap sm:space-x-2">
            <p className="text-tn_text_grey text-sm">{companyName}</p>
            <p className="text-tn_dark font-semibold text-sm">{payRate} / hr</p>
          </div>
        </div>

        {/* Apply Button */}
        {userType == "employer" && btnText && (
          <>
            <span className="absolute top-0 right-0">
              <span
                className="border rounded-full border-tn_text_grey p-1 w-8 h-8 flex items-center justify-center cursor-pointer hover:opacity-80 duration-200"
                onClick={() => onClickToEdit() ?? {}}
              >
                <FaPencil size={12} />
              </span>
            </span>
          </>
        )}
      </div>

      {/* Date and Time Info */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-green-100 text-tag_green px-3 py-1 rounded-full text-xs font-medium flex items-center">
          <FaCalendar size={12} className="mr-1" />
          {dateRange}
        </span>
        <span className="bg-orange-100 text-tag_brown px-3 py-1 rounded-full text-xs font-medium flex items-center">
          <FaClock size={12} className="mr-1" />
          {timeRange}
        </span>
      </div>

      {/* Level and Location */}
      <div className="flex flex-wrap gap-2 mb-4 truncate">
        {/* <span className="bg-purple-100 text-tag_purple px-3 py-1 rounded-full text-xs font-medium flex items-center">
          <FaCrown size={12} className="mr-1" />
          {level}
        </span> */}
        
        {/* <span className="bg-blue-100 text-tag_blue px-3 py-1 rounded-full text-xs font-medium flex items-center">
          <FaMapMarker size={12} className="mr-1" />
          {address}
        </span> */}
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 flex-grow truncate">
        {description}
      </p>

      {/* Applicants Section */}
      {applicants && userType !== "employee" && (
        <div className="flex items-center justify-between gap-2 mt-4">
          {/* Applicants Button */}
          {applicants.length > 0 && (
            <button
              className="flex items-center w-full rounded-site justify-center text-tn_dark border border-tn_light_grey text-sm font-medium p-2"
              onClick={onClick}
            >
              {isEmployeeView ? "View Job" : "View Applicants"}{" "}
              <FaArrowRightLong className="ml-2" />
            </button>
          )}

          {/* View Job Button */}
          {userType === "employer" && (
            <button
              className="bg-tn_primary w-full text-white py-2 rounded-full hover:bg-opacity-80 font-medium transition duration-300"
              onClick={handleApplyClick}
            >
              View Shift
            </button>
          )}
        </div>
      )}

      {userType === "employer" && !isEmployer && (
        <div className="mt-auto">
          <button
            className="bg-tn_primary w-full text-white py-2 rounded-full hover:bg-opacity-80 font-medium transition duration-300"
            onClick={handleApplyClick}
          >
            View Shift
          </button>
        </div>
      )}

      {/* Apply/View Job Button */}
      {userType === "employee" && (
        <div className="mt-auto">
          <button
            className={`${
              buttonText == "View Job" ? "bg-tn_pink" : "bg-tn_primary"
            } w-full text-white py-2 rounded-full hover:bg-opacity-80 font-semibold transition duration-300`}
            onClick={handleApplyClick}
          >
            {buttonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default JobCard;
