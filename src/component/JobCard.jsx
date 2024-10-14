import React from "react";

const JobCard = ({
  companyLogo,
  jobTitle,
  companyName,
  payRate,
  dateRange,
  timeRange,
  level,
  location,
  description,
}) => {
  return (
    <div className="w-full rounded-2xl shadow-md bg-white p-6">
      {/* Header */}
      <div className="flex items-center mb-4">
        <img
          src={companyLogo}
          alt={companyName}
          className="w-16 h-16 object-contain mr-4 rounded-lg"
        />
        <div>
       
            <h2 className="text-xl font-semibold text-tn_dark_field">
              {jobTitle}
            </h2>
            <div className="flex space-x-2">
              <p className="text-tn_text_grey text-sm">{companyName}</p>
              <p className="text-tn_dark font-semibold text-sm">
                {payRate} / hr
              </p>
           
          </div>
        </div>
      </div>

      {/* Date and Time Info */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
          {dateRange}
        </span>
        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
          {timeRange}
        </span>
      </div>

      {/* Level and Location */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
          {level}
        </span>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
          {location}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4">{description}</p>

      {/* Apply Button */}
      <button className="w-full bg-orange-500 text-white py-2 rounded-full font-semibold hover:bg-orange-600 transition duration-300">
        Apply
      </button>
    </div>
  );
};

export default JobCard;
