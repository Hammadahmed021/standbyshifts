import React, { useEffect, useState } from "react";
import { checkAppliersOnJob } from "../../utils/Api";
import { JobCard } from "../../component";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AppliedJobs = () => {
  const navigate = useNavigate();
  const [appliers, setAppliers] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const userType = userData?.user?.type;
  useEffect(() => {
    const getAppliers = async () => {
      const response = await checkAppliersOnJob();
      console.log(response?.data, "eresd>>>>>>>>>>");
      setAppliers(response?.data);
    };
    getAppliers();
  }, []);
  return (
    <>
      <div className="container my-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {appliers?.map((job) => (
            <JobCard
            className={'shadow-xl'}
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
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default AppliedJobs;
