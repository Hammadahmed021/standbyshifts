import React, { useEffect, useState } from "react";
import { EmployerJobCard, JobCard } from "../../component";
import { fetchAllJobByEmployer } from "../../utils/Api";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const ManageJobs = () => {
  const navigate = useNavigate();
  const [allJobs, setAllJobs] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const userType = userData?.user?.type || userData?.type;
  useEffect(() => {
    const fetchAllJobs = async () => {
      const response = await fetchAllJobByEmployer();
      setAllJobs(response?.data);
    };
    fetchAllJobs();
  }, []);
  return (
    <>
      <div className="container my-10">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {allJobs?.map((job) => (
            <EmployerJobCard
              key={job.id}
              loading={false}
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
              btnText={"Edit"}
              onClick={() => {
                navigate(`/post-job`, {
                  state: job,
                });
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ManageJobs;
