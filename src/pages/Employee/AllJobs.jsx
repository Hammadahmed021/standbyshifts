import React, { useEffect, useState } from "react";
import { getJobsByFilter } from "../../utils/Api";
import { JobCard, Search, LoadMore } from "../../component";
import { FaFilter } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const AllJobs = () => {
  const location = useLocation();
  const [jobs, setJobs] = useState(null);
  const [afterSearch, setAfterSearch] = useState([]);
  const [visibleJobsCount, setVisibleJobsCount] = useState(6); // Initially show 6 jobs
  const userData = useSelector((state) => state.auth.userData);
  const userType = userData?.user?.type;

  const getJobs = async (e) => {
    const res = await getJobsByFilter({...location.state,jobTitle:e ?? location?.state?.jobTitle});
    setJobs(res?.data??[]);
    console.log(JSON.stringify(res?.data), "res?.data?>>>>>>>>>>>>>");
    // Check if there are more jobs than the initial load
  };
  useEffect(() => {
    getJobs();
  }, []);

  const hasMore =jobs != null ? visibleJobsCount < jobs.length:false;

  const handleLoadMore = () => {
    setVisibleJobsCount((prevCount) => prevCount + 6); // Increase visible job count by 6
  };

const onSearchText = (e)=>{
  setJobs(null)
  getJobs(e);
}

  return (
    <div className="container my-10 px-0">
      <div className="flex justify-between items-center">
        <Search onSearch={onSearchText} />
        {/* <span className="bg-tn_primary rounded-full bg-contain w-8 h-8 inline-flex items-center justify-center">
          <FaFilter size={16} color="#fff" />
        </span> */}
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {!jobs || jobs === null
            ? // Show skeleton loaders for the number of jobs you expect to show
              [...Array(3)].map((_, index) => (
                <div key={index} className="p-2">
                  <JobCard loading={true} /> {/* Loader JobCard */}
                </div>
              ))
            :jobs?.length ==0 ? <h1>no data found</h1> : jobs?.slice(0, visibleJobsCount)?.map((job) => (
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
