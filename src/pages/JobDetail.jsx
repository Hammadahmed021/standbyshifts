import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../utils/Api";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserAlt,
} from "react-icons/fa";
import { EmpCardSlider, Loader } from "../component";
const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      const response = await getJobById(id); // Fetch job details by ID
      setJob(response?.data);
      setRelatedJobs(response?.data?.relatedJobs);
    };

    fetchJobDetails();
  }, [id]);
  console.log(job, "job");

  if (!job) return <div className="container text-center pt-8"><Loader /></div>;

  return (
    <>
      <div className="flex flex-col lg:flex-row  container space-x-4 my-16">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 p-4  bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">
                {job?.details?.title || "Job Title"}
              </h2>
              <p className="text-gray-500">
                Job type: {job?.details?.designation || "Designation"}
              </p>
            </div>
            <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600">
              Apply
            </button>
          </div>

          <div className="flex items-center text-gray-600 mb-4">
            <FaCalendarAlt className="mr-2 text-green-600" />
            <span>
              {new Date(job?.details?.start_date).toLocaleDateString()} to{" "}
              {new Date(job?.details?.end_date).toLocaleDateString()}
            </span>
            <FaClock className="ml-4 mr-2 text-orange-600" />
            <span>
              {job?.details?.shift_start_time} - {job?.details?.shift_end_time}
            </span>
            <FaUserAlt className="ml-4 mr-2 text-purple-600" />
            <span>{job?.details?.experience_level || "Experience Level"}</span>
            <FaMapMarkerAlt className="ml-4 mr-2 text-blue-600" />
            <span>
              {job?.details?.city}, {job?.details?.state}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-gray-700">
              {job?.details?.description || "No description available."}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job?.details?.expertise?.length ? (
                job?.details.expertise.map((skill) => (
                  <span
                    key={skill.id}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full"
                  >
                    {skill.title}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills listed.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 p-4  bg-white rounded-lg shadow-md">
          <div className="mb-4">
            <img
              src={
                job?.details?.user?.profile_image || "/default-company-logo.png"
              }
              alt={job?.details?.user?.name || "Company Logo"}
              className="w-20 h-20 rounded-full mb-2"
            />
            <h3 className="text-lg font-bold">
              {job?.details?.user?.name || "Company Name"}
            </h3>
            <p className="text-gray-500">View Company Profile</p>
          </div>

          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-600">
              Member Since
            </h4>
            <p>
              {new Date(job?.details?.user?.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-600">Industry</h4>
            <p>
              {job?.details?.industry_id
                ? job?.details?.industry_id
                : "Not specified"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-100">
        <div className="container py-10">
          <div className="w-[50%] mx-auto mt-6">
            <h3 className="text-tn_dark text-center text-5xl inline sm:block leading-tight font-semibold">
              Related Jobs
            </h3>
            <p className=" my-4 text-base w-full text-tn_dark  font-normal  text-center">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout.
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
  );
};

export default JobDetail;
