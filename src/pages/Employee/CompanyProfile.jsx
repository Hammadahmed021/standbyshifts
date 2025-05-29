import React, { useEffect, useState } from "react";
import {
  getCompanyProfile,
  getCompanyProfileEmployer,
  giveRating,
} from "../../utils/Api";
import { useParams } from "react-router-dom";
import {
  CompanyProfiles,
  JobCard,
  Loader,
  LoadMore,
  RatingModal,
} from "../../component";
import { useSelector } from "react-redux";
import { FaFilter } from "react-icons/fa";
import { showSuccessToast } from "../../utils/Toast";

const CompanyProfile = () => {
  const { companyId } = useParams(); // Get companyId from URL
  const [companyData, setCompanyData] = useState(null);
  const [visibleJobsCount, setVisibleJobsCount] = useState(6); // Initially show 6 jobs
  const userData = useSelector((state) => state.auth.userData);
  const userType = userData?.type || userData?.user?.type;
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratings, setRatings] = useState([]); // Initialize with ratings

  // console.log(companyData, "companyData >>>>>>>>>>>>");
  // console.log(companyId, "companyId >>>>>>>>>>>>");
  // console.log(userData, "userData  >>>>>>>>>>>>");

  useEffect(() => {
    if (companyData?.ratingsReceived) {
      setRatings(companyData.ratingsReceived);
      // console.log(companyData.ratingsReceived, "ratings updated in state");
    }
  }, [companyData?.ratingsReceived]);

  const openRatingModal = () => {
    setIsRatingModalOpen(true);
  };

  // Function to close the modal
  const closeRatingModal = () => {
    setIsRatingModalOpen(false);
  };

  // Function to handle submission of rating and feedback
  // const handleRatingSubmit = async (ratingData) => {
  //   const rateData = {
  //     ratee_id: companyId /* specify the ratee ID */,
  //     user_id: userData?.user?.id /* specify the user ID */,
  //     rating: ratingData?.rating,
  //     review: ratingData?.feedback,
  //   };
  //   try {
  //     const response = await giveRating(rateData);

  //     showSuccessToast("You've successfully rated!");
  //     console.log("Rating submitted successfully:", response.data);
  //     setRatings((prevRatings) => [
  //       ...prevRatings,
  //       response?.data?.ratingsReceived,
  //     ]); // Add new rating
  //   } catch (error) {
  //     console.error("Error submitting rating:", error.message);
  //   } finally {
  //     closeRatingModal();
  //   }
  // };

  const handleRatingSubmit = async (ratingData) => {
    const rateData = {
      ratee_id: companyId, // specify the ratee ID
      user_id: userData?.user?.id, // specify the user ID
      rating: ratingData?.rating,
      review: ratingData?.feedback,
    };

    try {
      const response = await giveRating(rateData);
      // console.log(response, 'response >>>>>>');


      // If the response is successful, show a success toast
      if (response?.message == "Profile rated successfully") {
        showSuccessToast("You've successfully rated!");
        // console.log("Rating submitted successfully:", response.data);

        // Construct the new rating object based on API response
        const newRating = {
          id: response?.data?.ratingsReceived?.id,
          rating: ratingData?.rating,
          review: ratingData?.feedback,
          created_at: new Date().toISOString(),
        };

        // Update the ratings state with the new rating at the top
        setRatings((prevRatings) => [newRating, ...prevRatings]);
      }
    } catch (error) {
      console.error("Error submitting rating:", error.message);
    } finally {
      closeRatingModal();
    }
  };

  // console.log(userType, 'userType compa1');


  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        if (userType == "employee") {
          const response = await getCompanyProfile(companyId); // Pass companyId to API
          setCompanyData(response.data);
        } else {
          // console.log(userType, "user type employer >>>>>>>>>>");

          const response = await getCompanyProfileEmployer(companyId); // Pass companyId to API
          setCompanyData(response.data);
        }
      } catch (error) {
        console.error("Error fetching company profile:", error);
      }
    };

    if (companyId) {
      fetchCompanyProfile(); // Trigger API call if companyId is available
    }
  }, [companyId, getCompanyProfile]);

  // console.log(companyData, "companyData");

  const hasMore = visibleJobsCount < companyData?.jobPostedByEmployer?.length;

  const handleLoadMore = () => {
    setVisibleJobsCount((prevCount) => prevCount + 6); // Increase visible job count by 6
  };

  if (!companyData) {
    return (
      <>
        <Loader />
      </>
    );
  }
  const checkLayout = "1"; // Check layout from profile
  // console.log(companyData, "companyData >>>>>>>>>>>>>>>>");

  return (
    <>
      {companyData ? (
        <CompanyProfiles
          profile={companyData?.about}
          layout={checkLayout}
          count={companyData?.jobPostCount}
        />
      ) : (
        <p>
          <Loader />
        </p> // Show loading text until profile data is available
      )}
      <div className="container my-16">
        <div className="flex items-center justify-between my-10">
          <h3 className="text-3xl sm:text-4xl text-tn_dark font-semibold">Rate Company</h3>
        </div>
        <div className="p-4  bg-white rounded-2xl shadow-xl h-auto mt-4">
          <div className="flex items-start justify-between mb-6">
            <span className="flex flex-col">
              <h2 className="text-2xl font-semibold capitalize items-center">
                Rate {companyData?.about?.name}
              </h2>
                <span
                  className={`text-xs underline cursor-pointer ${companyData?.eligibleToRate == true && "pointer-events-none opacity-75"
                    }`}
                  onClick={openRatingModal}
                >
                  {companyData?.isRated !== true
                    ? "Already rated"
                    : "Click to rate"}
                </span>
            </span>

            <span className="flex  gap-1">
              <span className="text-sm text-tn_dark">
                Ratings ({Math.floor(companyData.averageRating)}/<b>5</b>)
              </span>
            </span>
          </div>
          {/* Display each rating */}
          {ratings.length > 0 ? (
            ratings
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by latest date
              .slice(0, 3) // Limit to the first 3 items
              .map((rating) => (
                <div key={rating?.id} className="py-4 border-b last:border-0">
                  <div className="flex items-center mb-2 justify-between">
                    <span className="text-yellow-500 mr-2">
                      {"⭐".repeat(rating?.rating)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {rating?.created_at
                        ? new Date(rating.created_at).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <p className="text-gray-800">
                    {rating?.review || "No review provided"}
                  </p>
                </div>
              ))
          ) : (
            <p className="text-gray-500">No ratings yet</p>
          )}
        </div>
      </div>
      <div className="container my-16">
        <div className="flex items-center justify-between my-10">
          <h3 className="text-3xl sm:text-4xl text-tn_dark font-semibold">Shifts</h3>
          {/* <span className="bg-tn_pink rounded-full bg-contain w-8 h-8 inline-flex items-center justify-center">
            <FaFilter size={16} color="#fff" />
          </span> */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!companyData || companyData.length === 0 ? (
            // Show skeleton loaders when loading, and a message if no jobs are available
            <>
              {[...Array(3)].map((_, index) => (
                <div key={index} className="p-2">
                  <JobCard loading={true} /> {/* Loader JobCard */}
                </div>
              ))}
              <div className="text-center p-4 text-black">
                <p>
                  No shifts available.{" "}
                  <a href="/post-job" className="text-blue-600 underline">
                    Post a shift now
                  </a>
                </p>
              </div>
            </>
          ) : (
            // If jobs are available, display the jobs list
            companyData?.jobPostedByEmployer
              ?.slice(0, visibleJobsCount)
              ?.map((job) => (
                <JobCard
                  className={"shadow-xl"}
                  jobId={job?.id}
                  key={job.id}
                  companyLogo={companyData?.about?.employer?.logo} // Replace with actual logo
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
                  loading={false}
                  applicants={job?.applicant}
                />
              ))
          )}
        </div>
        <LoadMore
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          className="mt-5"
        />
      </div>

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={closeRatingModal}
        onSubmit={handleRatingSubmit}
        Rating={companyId}
      />
    </>
  );
};

export default CompanyProfile;
