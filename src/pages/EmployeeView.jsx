import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEmployeeById } from "../utils/Api";
import {
  FaBagShopping,
  FaBoxesPacking,
  FaPencil,
  FaTrashCan,
} from "react-icons/fa6";
import { people } from "../assets";
import {
  FaCalendarAlt,
  FaClock,
  FaFileAlt,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaTrash,
  FaUserAlt,
  FaUserCircle,
  FaWolfPackBattalion,
} from "react-icons/fa";
import { BsBackpack2Fill } from "react-icons/bs";
import { useSelector } from "react-redux";

const EmployeeView = () => {
  const [employee, setEmployee] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const userType = userData?.user?.type;
  const { id } = useParams();
  console.log(id, "id>>>>>>>>>>");
  useEffect(() => {
    const getEmployee = async (id) => {
      try {
        const response = await getEmployeeById(id);
        setEmployee(response?.data);
        console.log(response?.data, "response employee signle");
        // return response;
      } catch (error) {
        console.log(error || "error fetching employee data");
      }
    };
    getEmployee(id);
  }, [id]);

  return (
    <>
      <div className="flex flex-col lg:flex-row  container space-x-4 my-16">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 p-4  bg-white rounded-2xl shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 flex space-x-2 items-center text-sm">
                <FaBagShopping size={14} className="mr-2" /> Job type:{" "}
                <span className="font-semibold text-tn_dark">
                  {employee?.designation || "Designation"}
                </span>
              </p>
              <h2 className="text-2xl font-semibold capitalize flex items-center mt-2">
                <img
                  src={people}
                  className="mr-2 rounded-full w-8 h-8 bg-tn_light_grey"
                />{" "}
                {employee?.title || "Job Title"}
              </h2>
            </div>
          </div>

          <div className="flex items-center justify-between text-gray-600 mb-6">
            <div className="flex items-center justify-start gap-2 mb-2">
              <span className="inline-flex text-sm text-tag_green bg-tag_green bg-opacity-20 items-center px-2 py-1 rounded-2xl">
                <FaCalendarAlt className="mr-2 text-tag_green" size={12} />
                <span>
                  {new Date(employee?.start_date).toLocaleDateString()} to{" "}
                  {new Date(employee?.end_date).toLocaleDateString()}
                </span>
              </span>
              <span className="inline-flex text-sm text-tag_brown bg-tag_brown bg-opacity-20 items-center px-2 py-1 rounded-2xl">
                <FaClock className="mr-2 text-tag_brown" />
                <span>
                  {employee?.shift_start_time} - {employee?.shift_end_time}
                </span>
              </span>
              <span className="inline-flex text-sm text-tag_purple bg-tag_purple bg-opacity-20 items-center px-2 py-1 rounded-2xl">
                <FaUserAlt className="mr-2 text-tag_purple" />
                <span className="capitalize">
                  {employee?.experience_level || "Experience Level"}
                </span>
              </span>
              <span className="inline-flex text-sm text-tag_blue bg-tag_blue bg-opacity-20 items-center px-2 py-1 rounded-2xl">
                <FaMapMarkerAlt className="mr-2 text-tag_blue" />
                <span className="capitalize">
                  {employee?.city}, {employee?.state}
                </span>
              </span>
            </div>
            <p className="text-xl font-semibold text-tn_dark">
              ${employee?.per_hour_rate} / hr
            </p>
          </div>

          <hr className="border-b border-tn_light_grey my-6" />

          <div className="mb-6">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-gray-700">
              {employee?.description || "No description available."}
            </p>
          </div>
          <hr className="border-b border-tn_light_grey my-6" />

          <div className="mb-6">
            <h3 className="text-lg font-semibold">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {employee?.expertise?.length ? (
                employee.expertise.map((skill) => (
                  <span
                    key={skill.id}
                    className="border border-tn_light_grey text-tn_dark px-3 py-1 rounded-full text-sm"
                  >
                    {skill.title}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills listed.</p>
              )}
            </div>
          </div>
          <hr className="border-b border-tn_light_grey my-6" />
          <h3 className="text-lg font-semibold"> Qualifications & Ability</h3>
          <p>{employee?.qualification}</p>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 p-0">
          <div className="p-4  bg-white rounded-2xl shadow-xl h-auto">
            <div className="mb-4 flex gap-2 items-center">
              <img
                src={employee?.user?.profile_image || people}
                alt={employee?.user?.name || "Company Logo"}
                className="w-20 h-20 object-contain rounded-2xl bg-slate-100 shadow-sm"
              />
              <span>
                <h3 className="text-lg font-bold">
                  {employee?.user?.name || "Company Name"}
                </h3>
                {/* <p
                  className="text-tn_pink text-xs font-medium cursor-pointer"
                  onClick={handleViewProfileClick}
                >
                  View Company Profile
                </p> */}
              </span>
            </div>
            <hr className="border-b border-tn_light_grey my-6" />

            <div className="mb-4 flex justify-between items-center">
              <h4 className="text-sm text-tag_purple  bg-tag_purple  bg-opacity-20  px-2 py-1 rounded-2xl flex justify-between items-center">
                <FaUserCircle className="mr-2" /> Member Since
              </h4>
              <p className="font-semibold">
                {new Date(employee?.user?.created_at).toLocaleDateString()}
              </p>
            </div>

            <hr className="border-b border-tn_light_grey my-6" />

            <div className="mb-4 flex justify-between items-center">
              <h4 className="text-sm text-tag_brown  bg-tag_brown  bg-opacity-20  px-2 py-1 rounded-2xl flex justify-between items-center">
                <FaBoxesPacking className="mr-2" /> Industry
              </h4>
              <p className="font-semibold">
                {employee?.industry_id
                  ? employee?.industry_id
                  : "Not specified"}
              </p>
            </div>

            <hr className="border-b border-tn_light_grey my-6" />

            <div className="mb-4 flex justify-between items-center">
              <h4 className="text-sm text-tag_green  bg-tag_green  bg-opacity-20  px-2 py-1 rounded-2xl flex justify-between items-center">
                <BsBackpack2Fill className="mr-2" /> Job Posts
              </h4>
              <p className="font-semibold">10</p>
            </div>
          </div>
        </div>
      </div>
      {userType == "employee" && (
        <>
          <div className="bg-gray-100">
            <div className="container py-10">
              <div className="w-[50%] mx-auto mt-6">
                <h3 className="text-tn_dark text-center text-5xl inline sm:block leading-tight font-semibold">
                  Related Jobs
                </h3>
                <p className=" my-4 text-base w-full text-tn_dark  font-normal  text-center">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </p>
              </div>

              <div className=" w-full">
                <div className="flex flex-col items-ends justify-center px-6 employer">
                  <EmpCardSlider data={relatedJobs} slidesToShow={6} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EmployeeView;
