import React, { useEffect, useState } from "react";
import { fetchSingleDetailEmployer } from "../../utils/Api"; // Adjust this path if necessary
import { CompanyProfiles, JobCard } from "../../component"; // Import the dynamic layout component
import { FaFilter } from "react-icons/fa";

const ProfileView = () => {
  const [profile, setProfile] = useState([]); // Initialize as null to check loading state

  useEffect(() => {
    const getEmployer = async () => {
      try {
        const response = await fetchSingleDetailEmployer();
        setProfile(response); // Set fetched profile data
        console.log(response, "res");
      } catch (error) {
        console.log("Unable to get employer data", error);
      }
    };

    getEmployer();
  }, []);

  const checkLayout = profile?.about?.layout || "1"; // Check layout from profile
  console.log(checkLayout, "checkLayout");

  return (
    <div>
      {profile ? (
        <CompanyProfiles profile={profile?.about} layout={checkLayout} count={profile?.jobPostCount}/>
      ) : (
        <p>Loading...</p> // Show loading text until profile data is available
      )}
      <div className="container my-6">
        <div className="flex items-center justify-between my-10">
          <h3 className="text-2xl text-tn_dark font-semibold">
            Jobs
          </h3>
          <FaFilter />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile?.jobsPostedByYou?.map((job) => (
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
