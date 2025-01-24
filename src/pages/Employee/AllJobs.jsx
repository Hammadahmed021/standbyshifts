import React, { useEffect, useState } from "react";
import { getJobsByFilter } from "../../utils/Api";
import { JobCard, Search, LoadMore } from "../../component";
import { FaFilter } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
import { BsBackpack } from "react-icons/bs";

const AllJobs = () => {
  const location = useLocation();
  const [originalJobs, setOriginalJobs] = useState([]); // To store unfiltered jobs
  const [jobs, setJobs] = useState([]); // To store filtered jobs
  const [appliedJobs, setAppliedJobs] = useState([]); // Jobs the user has applied to
  const [unappliedJobs, setUnappliedJobs] = useState([]); // Jobs the user hasn't applied to
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [visibleJobsCount, setVisibleJobsCount] = useState(6); // Initially show 6 jobs
  const [isShiftView, setIsShiftView] = useState(false); // Toggle state
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?.user?.id;
  const userType = userData?.type || userData?.user?.type;

  // Fetch jobs from API
  const getJobs = async (searchText = null) => {
    const res = await getJobsByFilter({
      ...location.state,
      jobTitle: searchText ?? location?.state?.jobTitle,
    });
    const fetchedJobs = res?.data ?? [];
    setOriginalJobs(fetchedJobs); // Save original jobs
    setJobs(fetchedJobs); // Show all jobs initially
  };

  const hasMore = isShiftView
    ? appliedJobs.length > visibleJobsCount
    : unappliedJobs.length > visibleJobsCount;

  const handleLoadMore = () => {
    setVisibleJobsCount((prevCount) => prevCount + 6); // Increase visible job count by 6
  };

  const handleSearch = (searchText) => {
    setSearchTerm(searchText); // Update search term
    const lowerCaseSearch = searchText.toLowerCase();

    // Filter jobs or reset to original jobs
    const filteredJobs = lowerCaseSearch
      ? originalJobs.filter((job) =>
        job.title?.toLowerCase().includes(lowerCaseSearch)
      )
      : originalJobs;

    setJobs(filteredJobs);
  };

  useEffect(() => {
    getJobs(); // Fetch jobs on component mount
  }, []);

  useEffect(() => {
    if (userId) {
      // Separate applied and unapplied jobs
      const applied = jobs.filter((job) =>
        job?.applicant?.some((applicant) => applicant.id === userId)
      );
      const unapplied = jobs.filter(
        (job) =>
          !job?.applicant?.some((applicant) => applicant.id === userId)
      );

      setAppliedJobs(applied);
      setUnappliedJobs(unapplied);
    }
  }, [jobs, userId]);


  const displayedJobs = isShiftView ? appliedJobs : unappliedJobs;

  return (
    <div className="container my-10 px-0">
      <div className="flex justify-between items-center">
        <span className="py-2 w-auto border outline-none focus:bg-gray-50 bg-white text-black rounded-site text-sm duration-200 border-gray-200 flex justify-between shadow-lg">
          <span className="flex items-center">
            <BsBackpack size={18} className="mx-3" />
            <input
              type="text"
              placeholder="Shift title or keywords"
              className="w-full outline-none"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </span>
          <LuSearch
            size={24}
            className="bg-tn_primary mr-2 rounded-full w-8 h-8 py-1 px-2 text-white"
            onClick={() => handleSearch(searchTerm)}
          />
        </span>
        {/* Toggle Tabs */}
        <div className="flex border border-gray-200 rounded-site overflow-hidden">
          <button
            onClick={() => setIsShiftView(true)} // Show Applied Shifts
            className={`px-4 py-2 text-sm font-medium ${isShiftView
              ? "bg-tn_pink text-white" // Active Tab Styling
              : "text-gray-500 hover:text-tn_pink"
              }`}
          >
            Applied Shifts
          </button>
          <button
            onClick={() => setIsShiftView(false)} // Show Unapplied Shifts
            className={`px-4 py-2 text-sm font-medium ${!isShiftView
              ? "bg-tn_primary text-white" // Active Tab Styling
              : "text-gray-500 hover:text-tn_primary"
              }`}
          >
            Unapplied Shifts
          </button>
        </div>

      </div>
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {!displayedJobs || displayedJobs === null ? (
            // Show skeleton loaders for the number of jobs you expect to show
            [...Array(3)].map((_, index) => (
              <div key={index} className="p-2">
                <JobCard loading={true} /> {/* Loader JobCard */}
              </div>
            ))
          ) : displayedJobs?.length === 0 ? (
            <h2>No data found</h2>
          ) : (
            displayedJobs?.slice(0, visibleJobsCount)?.map((job) => (
              <div key={job?.id} className="p-2">
                <JobCard
                  className={"shadow-xl"}
                  jobId={job?.id}
                  key={job?.id}
                  companyLogo={job?.user?.employer?.logo} // Replace with actual logo
                  jobTitle={job?.title}
                  companyName={job?.city} // You can also pass the company name if available
                  payRate={`$${job?.per_hour_rate}`}
                  dateRange={`${new Date(
                    job?.start_date
                  ).toLocaleDateString()} to ${new Date(
                    job?.end_date
                  ).toLocaleDateString()}`}
                  timeRange={`${job?.shift_start_time} - ${job?.shift_end_time}`}
                  level={job?.experience_level}
                  address={`${job?.location}, ${job?.state}`}
                  description={job?.description}
                  userType={userType}
                  applicants={job?.applicant} // Pass applicants to JobCard
                  loading={false}
                />
              </div>
            ))
          )}
        </div>
        {/* Load More Component */}
        <LoadMore
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          className="mt-5"
        />
      </div>
    </div>
  );
};

export default AllJobs;
