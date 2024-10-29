import React, { useEffect, useState } from "react";
import { getJobsByFilter } from "../../utils/Api";
import { JobCard, Search, LoadMore } from "../../component";
import { FaFilter } from "react-icons/fa";
import { useSelector } from "react-redux";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [visibleJobsCount, setVisibleJobsCount] = useState(6); // Initially show 6 jobs
  const userData = useSelector((state) => state.auth.userData);
  const userType = userData?.user?.type;

  useEffect(() => {
    const getJobs = async () => {
      const res = await getJobsByFilter();
      setJobs(res?.data);
      console.log(res?.data, "res?.data?>>>>>>>>>>>>>");
      // Check if there are more jobs than the initial load
    };
    getJobs();
  }, []);

  const hasMore = visibleJobsCount < jobs.length;

  const handleLoadMore = () => {
    setVisibleJobsCount((prevCount) => prevCount + 6); // Increase visible job count by 6
  };

  return (
    <div className="container my-10 px-0">
      <div className="flex justify-between items-center">
        <Search />
        <span className="bg-tn_primary rounded-full bg-contain w-8 h-8 inline-flex items-center justify-center">
          <FaFilter size={16} color="#fff" />
        </span>
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {!jobs || jobs.length === 0
            ? // Show skeleton loaders for the number of jobs you expect to show
              [...Array(3)].map((_, index) => (
                <div key={index} className="p-2">
                  <JobCard loading={true} /> {/* Loader JobCard */}
                </div>
              ))
            : jobs?.slice(0, visibleJobsCount)?.map((job) => (
                <div key={job?.id} className="p-2">
                  <JobCard
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
              ))}
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
