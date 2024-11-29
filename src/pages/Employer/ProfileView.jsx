import React, { useEffect, useState } from "react";
import { fetchSingleDetailEmployer } from "../../utils/Api"; // Adjust this path if necessary
import { CompanyProfiles, JobCard, Loader } from "../../component"; // Import the dynamic layout component
import { FaFilter } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LayoutCards from "../../component/Employer/LayoutCards";

const ProfileView = () => {
  const [profile, setProfile] = useState([]); // Initialize as null to check loading state
  const userData = useSelector((state) => state.auth.userData);
  const userType = userData?.user?.type;

  useEffect(() => {
    const getEmployer = async () => {
      try {
        const response = await fetchSingleDetailEmployer();
        setProfile(response); // Set fetched profile data
        console.log(response, "res >>>>>");
      } catch (error) {
        console.log("Unable to get employer data", error);
      }
    };

    getEmployer();
  }, []);

  const checkLayout = profile?.about?.layout || "1"; // Check layout from profile
  console.log(
    profile?.jobsPostedByYou?.length,
    "profile?.jobsPostedByYou?.length"
  );

  const profiles = [
    {
      logo: "https://via.placeholder.com/50",
      title: "McDonald's",
      description: "A global fast-food chain.",
      location: "New York, USA",
      layout: "1",
    },
    {
      logo: "https://via.placeholder.com/50",
      title: "Starbucks",
      description: "Famous for coffee and more.",
      location: "Seattle, USA",
      layout: "2",
    },
  ];
  return (
    <div>
      {profile ? (
        <CompanyProfiles
          profile={profile?.about}
          layout={checkLayout}
          count={profile?.jobPostCount}
        />
      ) : (
        <p>
          <Loader />
        </p> // Show loading text until profile data is available
      )}

      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {profiles.map((profile, index) => (
            <LayoutCards
              key={index}
              profile={profile}
              layout={profile.layout}
            />
          ))}
        </div>
      </div>



      <div className="container my-16">
        <div className="flex items-center justify-between my-10">
          <h3 className="text-4xl text-tn_dark font-semibold">Jobs</h3>
          {/* <span className="bg-tn_pink rounded-full bg-contain w-8 h-8 inline-flex items-center justify-center">
            <FaFilter size={16} color="#fff" />
          </span> */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile?.jobsPostedByYou?.length <= 0 ? (
            <>
              <p>
                No jobs available. <Link to={"/post-job"}>Post a job new</Link>
              </p>
            </>
          ) : (
            profile?.jobsPostedByYou?.map((job) => (
              <JobCard
                className={"shadow-xl"}
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
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
