import React from "react";
import {
  FaMapMarkerAlt,
  FaChevronRight,
  FaCommentDots,
  FaArrowRight,
} from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const EmployeeDetailCard = ({ profile }) => {
  const {
    name,
    role,
    location,
    jobTitle,
    companyLogo,
    companyName,
    profileImage,
    jobId,
    employeeId,
    isHired,
    onHire,
    userData,
  } = profile;

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/job/${jobId}`); // Assuming job detail page is at '/job/:id'
  };

  const handleEmployeeViewClick = () => {
    navigate(`/employee-view/${employeeId}`); // Assuming job detail page is at '/job/:id'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm">
      {/* Profile Section */}
      <div className="flex items-center">
        <img
          src={profileImage}
          alt={name}
          className="w-[100px] h-[100px] rounded-full object-cover mr-4 shadow-lg"
        />
        <div>
          <h2 className="font-semibold text-xl capitalize">{name}</h2>
          <p className="text-gray-500">{role}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="inline-flex text-sm text-tag_blue bg-tag_blue bg-opacity-20 items-center px-2 py-1 rounded-2xl">
              <FaMapMarkerAlt className="mr-2 text-tag_blue" />
              <span className="capitalize">{location}</span>
            </span>
          </div>
        </div>
      </div>

      <hr className="border-b border-tn_light_grey my-3" />

      {/* Job Applied Section */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={companyLogo}
              alt={companyName}
              className="w-14 h-14 object-cover mr-3 rounded-md shadow-sm"
            />
            <div>
              <p className="text-gray-500 text-sm">Job applied:</p>
              <p className="font-semibold">{jobTitle}</p>
            </div>
          </div>
          <span className="cursor-pointer" onClick={handleClick}>
            <FaArrowRightLong color="#312D2D" />
          </span>
        </div>
        <hr className="border-b border-tn_light_grey my-3" />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6 space-x-2">
        <button
          className="rounded-site text-tn_dark border border-tn_light_grey text-sm font-medium w-full p-2"
          onClick={handleEmployeeViewClick}
        >
          View Profile
        </button>
        <button
          className="rounded-site  text-tn_dark border border-tn_light_grey text-sm font-medium w-full p-2"
          onClick={() => {
            console.log("sldhvklsbdklvbskldbvlksdbvlkbsdklvbskldb", isHired);
            if (!isHired) {
              onHire({ userId: employeeId, jobId });
            } else navigate("/chat", { state: userData });
          }}
        >
          {isHired ? "Chat" : "Hire"}
        </button>
        {/* <button className="rounded-full  text-tn_dark border border-tn_light_grey p-2">
          <FaCommentDots size={18} />
        </button> */}
      </div>
    </div>
  );
};

export default EmployeeDetailCard;
