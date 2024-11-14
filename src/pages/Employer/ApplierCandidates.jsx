import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEmployeeAppliedOnJob, hirePeople } from "../../utils/Api";
import { EmployeeDetailCard } from "../../component";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";

const ApplierCandidates = () => {
  const { id } = useParams();
  const [candidates, setCandidates] = useState([]);
  const getEmployeeOnJob = async (id) => {
    const response = await getEmployeeAppliedOnJob(id);
    setCandidates(response?.data);
  };
  useEffect(() => {
    getEmployeeOnJob(id);
  }, []);
  console.log(candidates, "response?.data>>>>>>>>>>>>>>>>");

  const hirePeopleFun = async ({ userId, jobId }) => {
    const hireForJob = await hirePeople({
      user_id: userId,
      job_id: jobId,
    });
    if (hireForJob.status == 200) {
      getEmployeeOnJob(id);
      showSuccessToast("Hired");
    } else showErrorToast(hireForJob?.data?.message);
  };
  console.log(candidates, "job");

  return (
    <>
      <div className="container my-10">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
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
                isHired: job?.is_hired,
                onHire: hirePeopleFun,
                userData: job,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ApplierCandidates;
