import React, { useEffect, useState } from "react";
import { checkAppliersOnJob } from "../../utils/Api";
import { JobCard, LoadMore } from "../../component";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AppliedJobs = () => {
  const navigate = useNavigate();
  const [appliers, setAppliers] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const [visibleJobsCount, setVisibleJobsCount] = useState(6); // Initially show 6 jobs
  const [loading, setLoading] = useState(true);

  const userType = userData?.user?.type || userData?.type;
  useEffect(() => {
    const getAppliers = async () => {
      setLoading(true); // Start loading
      const response = await checkAppliersOnJob();
      ////console.log(response?.data, "eresd>>>>>>>>>>");
      setAppliers(response?.data);
      setLoading(false); // End loading
    };
    getAppliers();
  }, []);

  const hasMore = appliers != null ? visibleJobsCount < appliers.length : false;

  const handleLoadMore = () => {
    setVisibleJobsCount((prevCount) => prevCount + 3); // Increase visible job count by 6
  };
  return (
    <>
      <div className="container my-10">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
          {/* {!appliers || appliers === null ? ( */}
          {loading ? (
            // Show skeleton loaders for the number of jobs you expect to show
            // [...Array(3)].map((_, index) => (
            //   <div key={index} className="p-2">
            //     <JobCard loading={true} /> {/* Loader JobCard */}
            //   </div>
            // ))
            <h2 className="col-span-4 text-start">Loading...</h2>
          ) : appliers?.length === 0 ? (
            // <h2>No shifts available to manage</h2>
            <>
              <h2><b>No Shifts Posted Yet</b> <br /> Start by creating your first shift to find the right candidates. Your opportunities will appear here once posted. <Link to="/post-job" className="text-blue-600 underline">Post a new shift</Link></h2>
            </>
          ) : (
            appliers?.slice(0, visibleJobsCount)?.map((job) => (
              <JobCard
                className={"shadow-xl"}
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
                applicants={job?.applicants}
                onClick={() => {
                  navigate(`/view-applicants/${job?.id}`); // Assuming job detail page is at '/job/:id'
                }}
                btnText={true}
                onClickToEdit={() => {
                  navigate(`/post-job`, {
                    state: job,
                  });
                }}
              />
            ))
          )}         
        </div>
        <div>
           {/* Load More Component */}
           <LoadMore
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            className="mt-5"
          />
        </div>
      </div>
    </>
  );
};

export default AppliedJobs;
