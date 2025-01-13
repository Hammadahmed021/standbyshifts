import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployeeById, giveRating } from "../utils/Api";
import {
  FaBagShopping,
  FaBoxesPacking,
  FaEnvelope,
  FaMessage,
  FaPencil,
  FaRegMessage,
  FaTrashCan,
} from "react-icons/fa6";
import { people, peoples } from "../assets";
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
import {
  BsBackpack2Fill,
  BsEnvelope,
  BsEnvelopeAtFill,
  BsPhone,
  BsPhoneFill,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import { BiSolidMessageAltDots } from "react-icons/bi";
import { EmployeeDetailCard, JobCard, RatingModal } from "../component";
import { showSuccessToast } from "../utils/Toast";

const EmployeeView = () => {
  const [employee, setEmployee] = useState([]);
  const [employeeJobs, setEmployeeJobs] = useState([]);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratings, setRatings] = useState([]); // Initialize with ratings

  const userData = useSelector((state) => state.auth.userData);
  const userType = userData?.user?.type;
  console.log(userData, "userData >>>>>");

  const { id } = useParams();
  const navigate = useNavigate();
  console.log(id, "id>>>>>>>>>>");

  useEffect(() => {
    if (employee?.ratings_received) {
      setRatings(employee.ratings_received);
      console.log(employee.ratings_received, "ratings updated in state");
    }
  }, [employee?.ratings_received]);

  useEffect(() => {
    const getEmployee = async (id) => {
      try {
        const response = await getEmployeeById(id);
        setEmployee(response?.data);
        setEmployeeJobs(response?.data?.applied_jobs);
        console.log(response?.data, "response employee signle");
        // return response;
      } catch (error) {
        console.log(error || "error fetching employee data");
      }
    };
    getEmployee(id);
  }, [id]);

  console.log(employeeJobs, "employeeJobs >>>>>>");

  // Function to open the modal
  const openRatingModal = () => {
    setIsRatingModalOpen(true);
  };

  // Function to close the modal
  const closeRatingModal = () => {
    setIsRatingModalOpen(false);
  };

  // Function to handle submission of rating and feedback
  const handleRatingSubmit = async (ratingData) => {
    const rateData = {
      ratee_id: employee?.id /* specify the ratee ID */,
      user_id: userData?.user?.id /* specify the user ID */,
      rating: ratingData?.rating,
      review: ratingData?.feedback,
    };
    try {
      const response = await giveRating(rateData);

      showSuccessToast("You've successfully rated!");
      console.log("Rating submitted successfully:", response.data);
      setRatings((prevRatings) => [
        ...prevRatings,
        response?.data?.ratings_received,
      ]); // Add new rating
    } catch (error) {
      console.error("Error submitting rating:", error.message);
    } finally {
      closeRatingModal();
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row  container lg:space-x-4 my-16">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 ">
          <div className=" mb-4 p-6 flex justify-between bg-white rounded-2xl shadow-xl relative border">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img
                  src={employee?.employee?.profile_picture || peoples}
                  className="mr-2 rounded-full w-24 h-24 bg-tn_light_grey"
                />
                <span>
                  <h2 className="text-2xl font-semibold capitalize flex items-center ">
                    {employee?.name || "Employee name"}
                  </h2>
                  <p className="text-tn_text_grey mb-3">
                    {employee?.industry?.title}
                  </p>
                  <span className="flex flex-wrap gap-3 items-center ">
                    <span className="inline-flex flex-wrap text-xs sm:text-sm text-tag_purple bg-tag_purple bg-opacity-20 items-center px-2 py-1 rounded-2xl">
                      <FaEnvelope className="mr-2 text-tag_purple" />
                      <span className="capitalize">
                        {employee?.email || "Experience Level"}
                      </span>
                    </span>
                    <span className="inline-flex flex-wrap text-xs sm:text-sm text-tag_blue bg-tag_blue bg-opacity-20 items-center px-2 py-1 rounded-2xl">
                      <FaMapMarkerAlt className="mr-2 text-tag_blue" />
                      <span className="capitalize">
                        {employee?.employee?.location}
                      </span>
                    </span>
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center">
              {/* <span className="inline-flex items-center px-4 py-2 bg-tn_dark rounded-site gap-2 text-white" onClick={() => { navigate('/chat', {state: employeeJobs})}}>
                <FaRegMessage /> Chat with applicant
              </span> */}
            </div>
          </div>
          <div className="mb-4 p-6  bg-white rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold capitalize items-center mb-6">
              {employee?.name || "Employee name"} Applied on your shifts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employeeJobs.map((job, ind) => (
                <JobCard
                  className={"border border-tn_light_grey shadow-none"}
                  jobId={job.id}
                  key={job.id}
                  companyLogo={job?.user?.employer?.logo} // Replace with actual logo
                  jobTitle={job.title}
                  companyName={job.city} // You can also pass the company name if available
                  payRate={`$${job.per_hour_rate}`}
                  dateRange={`${new Date(
                    job.start_date
                  ).toLocaleDateString()} to ${new Date(
                    job.end_date
                  ).toLocaleDateString()}`}
                  timeRange={`${job.shift_start_time} - ${job.shift_end_time}`}
                  level={job.experience_level}
                  address={`${job.location}, ${job.state}`}
                  description={job.description}
                  userType={userType}
                  // applicants={job?.applicants}
                  
                />
              ))}
            </div>
          </div>

          <div className="mb-4 p-6  bg-white rounded-2xl shadow-xl">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">About my self</h3>
              <p className="text-gray-700">
                {employee?.about || "No description available."}
              </p>
            </div>
            <hr className="border-b border-tn_light_grey my-6" />

            <div className="mb-6">
              <h3 className="text-lg font-semibold">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {employee?.skills?.length ? (
                  employee.skills.map((skill) => (
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

            <div className="mb-6">
              <h3 className="text-lg font-semibold">Work Experience</h3>
              <div className="space-y-4">
                {employee?.work_histories?.length ? (
                  employee.work_histories.map((history) => (
                    <div
                      key={history.id}
                      className="border border-tn_light_grey p-4 rounded-lg w-full flex flex-col gap-2"
                    >
                      {/* Date Created */}
                      <p className="text-xs text-tn_text_grey">
                        Added on:{" "}
                        {new Date(history.created_at).toLocaleDateString()}
                      </p>
                      {/* Job Title */}
                      <h3 className="text-lg font-medium capitalize text-tn_dark_field">
                      <span className="font-semibold">Shift Title:</span>{" "}
                        {history.title}
                      </h3>

                      {/* Job Duration */}
                      {/* <p className="text-sm text-tn_text_grey">
                        Duration: ({history.start_month}/{history.start_year} -{" "}
                        {history.end_month}/{history.end_year})
                      </p> */}

                      {/* Description */}
                      {history.description ? (
                        <p className="text-tn_text_grey text-sm">
                          <span className="font-semibold">Description:</span> {history.description}
                        </p>
                      ) : (
                        <p className="text-tn_text_grey">
                          No description provided.
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No work history listed.</p>
                )}
              </div>
            </div>
            {/* <h3 className="text-lg font-semibold"> Qualifications & Ability</h3>
            <p>{employee?.qualification}</p> */}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 p-0">
          <div className="p-4  bg-white rounded-2xl shadow-xl h-auto">
            <h2 className="text-2xl font-semibold capitalize items-center mb-6">
              Applicant Info
            </h2>

            <div className="mb-4 flex justify-between items-center">
              <h4 className="text-sm text-tag_purple  bg-tag_purple  bg-opacity-20  px-2 py-1 rounded-2xl flex justify-between items-center">
                <FaUserCircle className="mr-2" /> Member Since
              </h4>
              <p className="font-semibold">
                {new Date(employee?.created_at).toLocaleDateString()}
              </p>
            </div>

            <hr className="border-b border-tn_light_grey my-6" />

            <div className="mb-4 flex justify-between items-center">
              <h4 className="text-sm text-tag_brown  bg-tag_brown  bg-opacity-20  px-2 py-1 rounded-2xl flex justify-between items-center">
                <FaBoxesPacking className="mr-2" /> Industry
              </h4>
              <p className="font-semibold">
                {employee?.industry
                  ? employee?.industry?.title
                  : "Not specified"}
              </p>
            </div>

            <hr className="border-b border-tn_light_grey my-6" />

            <div className="mb-4 flex justify-between items-center">
              <h4 className="text-sm text-tag_green  bg-tag_green  bg-opacity-20  px-2 py-1 rounded-2xl flex justify-between items-center">
                <BsBackpack2Fill className="mr-2" /> Total Shifts Done
              </h4>
              <p className="font-semibold">{employee?.applied_jobs?.length}</p>
            </div>

            <hr className="border-b border-tn_light_grey my-6" />

            <div className="mb-4 flex justify-between items-center">
              <h4 className="text-sm text-tag_blue  bg-tag_blue  bg-opacity-20  px-2 py-1 rounded-2xl flex justify-between items-center">
                <BsEnvelopeAtFill className="mr-2" /> E-Mail address
              </h4>
              <p className="font-semibold">{employee?.email}</p>
            </div>

            <hr className="border-b border-tn_light_grey my-6" />

            <div className="mb-4 flex justify-between items-center">
              <h4 className="text-sm text-tag_purple  bg-tag_purple  bg-opacity-20  px-2 py-1 rounded-2xl flex justify-between items-center">
                <BsPhoneFill className="mr-2" /> Phone
              </h4>
              <p className="font-semibold">{employee?.phone}</p>
            </div>
          </div>

          <div className="p-4  bg-white rounded-2xl shadow-xl h-auto mt-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold capitalize items-center">
                Rate {employee?.name}
              </h2>
              <span className="flex items-center gap-1">
                <span
                  className={`text-sm underline cursor-pointer ${
                    employee?.isRated == true &&
                    "pointer-events-none opacity-75"
                  }`}
                  onClick={openRatingModal}
                >
                  {employee?.isRated == true
                    ? "Already rated"
                    : "Click to rate"}
                </span>
                <span className="text-sm text-tn_primary">
                  ⭐{Math.floor(employee.averageRating)}
                </span>
              </span>
            </div>
            {/* Display each rating */}
            {ratings.length > 0 ? (
              ratings
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by latest date
                .slice(0, 3) // Limit to the first 3 items
                .map((rating) => (
                  <div key={rating.id} className="py-4 border-b last:border-0">
                    <div className="flex items-center mb-2 justify-between">
                      <span className="text-yellow-500 mr-2">
                        {"⭐".repeat(rating.rating)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-800">
                      {rating.review || "No review provided"}
                    </p>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No ratings yet</p>
            )}
          </div>
        </div>
      </div>
      {userType == "employee" && (
        <>
          <div className="bg-gray-100">
            <div className="container py-10">
              <div className="w-[50%] mx-auto mt-6">
                <h3 className="text-tn_dark text-center text-5xl inline sm:block leading-tight font-semibold">
                  Related Shifts
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

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={closeRatingModal}
        onSubmit={handleRatingSubmit}
        Rating={employee?.employee?.id}
      />
    </>
  );
};

export default EmployeeView;
