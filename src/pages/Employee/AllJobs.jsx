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
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [visibleJobsCount, setVisibleJobsCount] = useState(6); // Initially show 6 jobs
  const userData = useSelector((state) => state.auth.userData);
  const userType = userData?.user?.type;

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

  const hasMore = jobs.length > visibleJobsCount;

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

  

  return (
    <div className="container my-10 px-0">
      <div className="flex justify-between items-center">
        <span className="py-2 w-auto border outline-none focus:bg-gray-50 bg-white text-black rounded-site text-sm duration-200 border-gray-200 flex justify-between shadow-lg">
          <span className="flex items-center">
            <BsBackpack size={18} className="mx-3" />
            <input
              type="text"
              placeholder="Job title or keywords"
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
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {!jobs || jobs === null ? (
            // Show skeleton loaders for the number of jobs you expect to show
            [...Array(3)].map((_, index) => (
              <div key={index} className="p-2">
                <JobCard loading={true} /> {/* Loader JobCard */}
              </div>
            ))
          ) : jobs?.length == 0 ? (
            <h2>no data found</h2>
          ) : (
            jobs?.slice(0, visibleJobsCount)?.map((job) => (
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
