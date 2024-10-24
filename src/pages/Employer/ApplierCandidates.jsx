import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEmployeeAppliedOnJob } from "../../utils/Api";
import { EmployeeDetailCard } from "../../component";

const ApplierCandidates = () => {
  const { id } = useParams();
  const [candidates, setCandidates] = useState([]);
  useEffect(() => {
    const getEmployeeOnJob = async (id) => {
      const response = await getEmployeeAppliedOnJob(id);
      setCandidates(response?.data);
    };
    getEmployeeOnJob(id);
  }, []);
  console.log(candidates, "response?.data>>>>>>>>>>>>>>>>");

  return (
    <>
      <div className="container my-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {candidates?.map((job, ind) => (
            <EmployeeDetailCard
              key={ind}
              profile={{
                name: job.name,
                location: job.location || "Location not specified", // Default location if none provided
                jobTitle: job?.applied_jobs?.title,
                companyLogo: job?.applied_jobs?.logo, // Ensure you have the logo URL
                profileImage: job?.profile_picture,
                jobId: job?.applied_jobs?.id,
                employeeId: job?.id,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ApplierCandidates;
