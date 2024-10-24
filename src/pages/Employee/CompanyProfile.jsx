import React, { useEffect, useState } from "react";
import { getCompanyProfile } from "../../utils/Api";
import { useParams } from "react-router-dom";
import { CompanyProfiles, JobCard, Loader, LoadMore } from "../../component";
import { useSelector } from "react-redux";
import { FaFilter } from "react-icons/fa";

const CompanyProfile = () => {
  const { companyId } = useParams(); // Get companyId from URL
  const [companyData, setCompanyData] = useState(null);
  const [visibleJobsCount, setVisibleJobsCount] = useState(6); // Initially show 6 jobs
  const userData = useSelector((state) => state.auth.userData);
  const userType = userData?.user?.type;

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await getCompanyProfile(companyId); // Pass companyId to API
        setCompanyData(response.data);
      } catch (error) {
        console.error("Error fetching company profile:", error);
      }
    };

    if (companyId) {
      fetchCompanyProfile(); // Trigger API call if companyId is available
    }
  }, [companyId, getCompanyProfile]);

  console.log(companyData, 'companyData');
  

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
  const checkLayout = companyData?.about?.layout || "1"; // Check layout from profile
  console.log(companyData, "companyData");

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
          <h3 className="text-4xl text-tn_dark font-semibold">Jobs</h3>
          <span className="bg-tn_pink rounded-full bg-contain w-8 h-8 inline-flex items-center justify-center">
          <FaFilter size={16} color="#fff" />
        </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!companyData || companyData.length === 0
            ? // Show skeleton loaders for the number of jobs you expect to show
              [...Array(3)].map((_, index) => (
                <div key={index} className="p-2">
                  <JobCard loading={true} /> {/* Loader JobCard */}
                </div>
              ))
            : companyData?.jobPostedByEmployer
                ?.slice(0, visibleJobsCount)
                ?.map((job) => (
                  <JobCard
                    jobId={job?.id}
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
                    location={`${job.location}, ${job.state}`}
                    description={job.description}
                    userType={userType}
                    loading={false}
                    applicants={job?.applicant}
                  />
                ))}
        </div>
        <LoadMore
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          className="mt-5"
        />
      </div>
    </>
  );
};

export default CompanyProfile;
