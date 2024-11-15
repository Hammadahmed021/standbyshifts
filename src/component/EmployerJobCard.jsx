import React from "react";
import { FaCalendar, FaClock, FaCrown, FaMapMarker } from "react-icons/fa";

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

const EmployerJobCard = ({
  companyLogo,
  jobTitle,
  companyName,
  payRate,
  dateRange,
  timeRange,
  level,
  location,
  description,
  btnText,
  onClick,
  loading, // Add loading prop
}) => {
  if (loading) {
    return <JobCardSkeleton />;
  }

  return (
    <div className="w-full rounded-2xl shadow-xl bg-white p-6 mb-6 flex flex-col h-full">
  {/* Header */}
  <div className="flex items-center mb-4">
    <img
      src={companyLogo}
      alt={companyName}
      className="w-16 h-16 object-cover mr-4 rounded-lg shadow-md bg-slate-400"
    />
    <div>
      <h2 className="text-xl font-semibold text-tn_dark_field">{jobTitle}</h2>
      <div className="flex space-x-2">
        <p className="text-tn_text_grey text-sm">{companyName}</p>
        <p className="text-tn_dark font-semibold text-sm">{payRate} / hr</p>
      </div>
    </div>
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
  <div className="flex flex-wrap gap-2 mb-4">
    <span className="bg-purple-100 text-tag_purple px-3 py-1 rounded-full text-xs font-medium flex items-center">
      <FaCrown size={12} className="mr-1" />
      {level}
    </span>
    <span className="bg-blue-100 text-tag_blue px-3 py-1 rounded-full text-xs font-medium flex items-center">
      <FaMapMarker size={12} className="mr-1" />
      {location}
    </span>
  </div>

  {/* Description */}
  <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>

      {/* Apply Button */}
      <button className="w-full bg-tn_primary text-white py-2 rounded-full font-semibold hover:bg-orange-600 transition duration-300" onClick={()=>onClick()??{}}>
        {btnText ?? "Apply"}
      </button>
    </div>
  );
};

export default EmployerJobCard;
