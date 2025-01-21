import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { applyJob, getJobByIdEmployee, getJobByIdEmployer } from "../utils/Api";
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
import { EmpCardSlider, Loader } from "../component";
import {
  FaBagShopping,
  FaBoxesPacking,
  FaPencil,
  FaTrashCan,
} from "react-icons/fa6";
import { people } from "../assets";
import { BsBackpack, BsBackpack2Fill } from "react-icons/bs";
import { showSuccessToast } from "../utils/Toast";
import { useSelector } from "react-redux";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const jobId = job?.details?.id;
  const initialApplicantStatus = job?.details?.applicant?.length > 0;
  const [applyForJob, setApplyForJob] = useState(initialApplicantStatus || []);
  const [isApplying, setIsApplying] = useState(false);
  console.log(id, "id job detail");
  const userData = useSelector((state) => state.auth.userData);
  const userType = userData?.user?.type || userData?.type;

  console.log(userType, "userType >>>>>>>>>>>>>>>>>>>>>>");

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (userType == "employee") {
        const response = await getJobByIdEmployee(id); // Fetch job details by ID
        console.log(
          response?.data,
          " employee response ?????????>>>>>>>>>>>>>>>"
        );

        setJob(response?.data);
        setApplyForJob(response?.data?.details?.applicant);
        setRelatedJobs(response?.data?.relatedJobs);
      } else {
        const response = await getJobByIdEmployer(id); // Fetch job details by ID
        console.log(
          response?.data,
          " employer response ?????????>>>>>>>>>>>>>>>"
        );

        setJob(response?.data);
        setApplyForJob(response?.data?.details?.applicant);
        setRelatedJobs(response?.data?.relatedJobs);
      }
    };

    fetchJobDetails();
  }, [id, jobId]);

  const handleViewProfileClick = () => {
    if (job?.details?.user?.id) {
      const companyId = job?.details?.user?.id;
      navigate(`/company/${companyId}`); // Assuming /company/:id is the profile page
    }
  };

  const applyOnJob = async (id) => {
    if (applyForJob.length === 0 && !isApplying) {
      try {
        setIsApplying(true); // Set applying status to true
        const response = await applyJob(id);
        console.log(response, "apply jobs res");

        if (response.status === 200) {
          showSuccessToast("Applied successfully.");

          // Update state after applying for the job
          setApplyForJob([1]); // Set any non-empty array to indicate application status

          // Reset the loading state after applying
          setTimeout(() => {
            setIsApplying(false);
          }, 2000); // 2-second delay before resetting the button
        }
      } catch (error) {
        console.error("Error applying for the job:", error);
        setIsApplying(false); // Reset applying status in case of error
      }
    }
  };
  useEffect(() => {
    if (job?.details?.applicant?.length > 0) {
      setApplyForJob(job.details.applicant); // Ensure the button shows "Applied" after reload
    }
  }, [job?.details?.applicant]);

  console.log(job?.details?.user?.industry?.title, 'hs>>>');
  
  

  if (!job)
    return (
      <div className="container text-center pt-8">
        <Loader />
      </div>
    );

  return (
    <>
      <div className="flex flex-col lg:flex-row s  container sm:space-x-4 my-8 sm:my-16">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 p-4  bg-white rounded-2xl shadow-xl">
          <div className="flex flex-wrap justify-between items-start mb-4">
            <div className="mb-4 sm:mb-0">
              <p className="text-gray-500 flex flex-wrap space-x-2 items-center text-sm">
                <FaBagShopping size={14} className="mr-2" /> Shift type:{" "}
                <span className="font-semibold text-tn_dark">
                  {job?.details?.designation || "Designation"}
                </span>
              </p>
              <h2 className="text-lg sm:text-2xl font-semibold capitalize flex items-center mt-2">
                <img
                  src={job?.details?.user?.employer?.logo}
                  className="mr-2 rounded-full w-8 h-8 bg-tn_light_grey"
                />{" "}
                {job?.details?.title || "Job Title"}
              </h2>
            </div>

            {userType == "employee" ? (
              <>
                <div className="flex gap-1">
                  {applyForJob?.length > 0 ? (
                    <>
                       {/* Button if the user has already applied */}
                      <button
                        className="bg-tn_primary bg-opacity-80 text-white p-2 text-sm w-[120px] rounded-full font-normal shadow-none cursor-not-allowed"
                        disabled
                      >
                        Applied
                      </button>
                      <button
                        className="bg-tn_pink text-white p-2 text-sm w-[120px] rounded-full font-normal hover:opacity-80 "
                        onClick={() =>
                          navigate("/chat", {
                            state: {
                              id: job?.details?.user?.id,
                              applied_jobs: {
                                id: job?.details?.id,
                                title: job?.details?.title
                              },
                              name: job?.details?.user?.name,
                            },
                          })
                        }
                      >
                        Chat
                      </button>
                    </>
                  ) : (
                    // Button if the user has not applied yet
                    <button
                      className="bg-tn_primary text-white p-2 text-sm w-[120px] rounded-full font-normal hover:opacity-80 shadow-custom-orange"
                      onClick={() => applyOnJob(jobId)}
                      disabled={isApplying}
                    >
                      {isApplying ? "Applying..." : "Apply"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <span className="flex items-center gap-2">
                  <span className="border rounded-full border-tn_text_grey p-1 w-8 h-8 flex items-center justify-center cursor-pointer">
                    <FaTrashCan
                      size={12}
                      onClick={() => console.log("deleting shit")}
                    />
                  </span>
                  <span className="border rounded-full border-tn_text_grey p-1 w-8 h-8 flex items-center justify-center cursor-pointer hover:opacity-80 duration-200">
                    <FaPencil
                      size={12}
                      onClick={() => {
                        navigate(`/post-job`, {
                          state: job?.details,
                        });
                      }}
                    />
                  </span>
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between text-gray-600 mb-6">
            <div className="flex flex-wrap items-center justify-start gap-2 mb-2">
              <span className="inline-flex text-sm text-tag_green bg-tag_green bg-opacity-20 items-center px-2 py-1 rounded-2xl">
                <FaCalendarAlt className="mr-2 text-tag_green" size={12} />
                <span>
                  {new Date(job?.details?.start_date).toLocaleDateString()} to{" "}
                  {new Date(job?.details?.end_date).toLocaleDateString()}
                </span>
              </span>
              <span className="inline-flex text-sm text-tag_brown bg-tag_brown bg-opacity-20 items-center px-2 py-1 rounded-2xl">
                <FaClock className="mr-2 text-tag_brown" />
                <span>
                  {job?.details?.shift_start_time} -{" "}
                  {job?.details?.shift_end_time}
                </span>
              </span>
              <span className="inline-flex text-sm text-tag_purple bg-tag_purple bg-opacity-20 items-center px-2 py-1 rounded-2xl">
                <FaUserAlt className="mr-2 text-tag_purple" />
                <span className="capitalize">
                  {job?.details?.experience_level || "Experience Level"}
                </span>
              </span>
              <span className="inline-flex text-sm text-tag_blue bg-tag_blue bg-opacity-20 items-center px-2 py-1 rounded-2xl">
                <FaMapMarkerAlt className="mr-2 text-tag_blue" />
                <span className="capitalize">
                  {job?.details?.city}, {job?.details?.state}
                </span>
              </span>
            </div>
            <p className="text-xl font-semibold text-tn_dark">
              ${job?.details?.per_hour_rate} / hr
            </p>
          </div>

          <hr className="border-b border-tn_light_grey my-6" />

          <div className="mb-6">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-gray-700 break-words">
              {job?.details?.description || "No description available."}
            </p>
          </div>
          <hr className="border-b border-tn_light_grey my-6" />

          <div className="mb-6">
            <h3 className="text-lg font-semibold">certificate</h3>
            <div className="flex flex-wrap gap-2">
              {job?.details?.certificate || "N/A"}
              {/* {job?.details?.expertise?.length ? (
                job?.details.expertise.map((skill) => (
                  <span
                    key={skill.id}
                    className="border border-tn_light_grey text-tn_dark px-3 py-1 rounded-full text-sm"
                  >
                    {skill.title}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills listed.</p>
              )} */}
            </div>
          </div>
          <hr className="border-b border-tn_light_grey my-6" />
          <h3 className="text-lg font-semibold"> notes</h3>
          <p>{job?.details?.notes || "N/A"}</p>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 p-0 mt-6 sm:mt-0">
          <div className="p-4  bg-white rounded-2xl shadow-xl h-auto">
            <div className="mb-4 flex gap-2 items-center">
              <img
                src={job?.details?.user?.employer?.logo || people}
                alt={job?.details?.user?.name || "Company Logo"}
                className="w-20 h-20 object-contain rounded-2xl bg-slate-100 shadow-sm"
              />
              <span>
                <h3 className="text-lg font-bold">
                  {job?.details?.user?.name || "Company Name"}
                </h3>
                <p
                  className="text-tn_pink text-xs font-medium cursor-pointer"
                  onClick={handleViewProfileClick}
                >
                  View Company Profile
                </p>
              </span>
            </div>
            <hr className="border-b border-tn_light_grey my-6" />

            <div className="mb-4 flex justify-between items-center">
              <h4 className="text-sm text-tag_purple  bg-tag_purple  bg-opacity-20  px-2 py-1 rounded-2xl flex justify-between items-center">
                <FaUserCircle className="mr-2" /> Member Since
              </h4>
              <p className="font-semibold">
                {new Date(job?.details?.user?.created_at).toLocaleDateString()}
              </p>
            </div>

            <hr className="border-b border-tn_light_grey my-6" />

            <div className="mb-4 flex justify-between items-center">
              <h4 className="text-sm text-tag_brown  bg-tag_brown  bg-opacity-20  px-2 py-1 rounded-2xl flex justify-between items-center">
                <FaBoxesPacking className="mr-2" /> Industry
              </h4>
              <p className="font-semibold">
                {job?.details?.user?.industry?.title
                  || "Not specified"}
              </p>
            </div>

            <hr className="border-b border-tn_light_grey my-6" />

            <div className="mb-4 flex justify-between items-center">
              <h4 className="text-sm text-tag_green  bg-tag_green  bg-opacity-20  px-2 py-1 rounded-2xl flex justify-between items-center">
                <BsBackpack2Fill className="mr-2" /> Shift Posts
              </h4>
              <p className="font-semibold">{job?.jobPostCount || '10'}</p>
            </div>
          </div>
        </div>
      </div>
      {userType == "employee" && (
        <>
          <div className="bg-gray-100">
            <div className="container py-6 sm:py-10">
              <div className="w-full md:w-[50%] mx-auto mt-6">
                <h3 className="text-tn_dark text-center text-4xl sm:text-5xl inline sm:block leading-tight font-semibold">
                  Related Shifts
                </h3>
                <p className=" my-4 text-base w-full text-tn_dark  font-normal text-start sm:text-center">
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

export default JobDetail;
