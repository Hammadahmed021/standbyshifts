import React, { useEffect, useState } from "react";
import { JobCard } from "../../component";
import { fetchAllJobByEmployer } from "../../utils/Api";
import { useSelector } from "react-redux";

const ManageJobs = () => {
  const [allJobs, setAllJobs] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const userType = userData?.user?.type;
  useEffect(() => {
    const fetchAllJobs = async () => {
      const response = await fetchAllJobByEmployer();
      setAllJobs(response?.data);
      console.log(response, "fetching all jobs by employer");
    };
    fetchAllJobs();
  }, []);
  return (
    <>
      <div className="container">
        Manange jobs idhr crud banado posted job ka
      </div>
      <div className="container my-8">
        <div className="grid grid-cols-3 gap-4">
          {allJobs?.map((job) => (
            <JobCard
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
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ManageJobs;
