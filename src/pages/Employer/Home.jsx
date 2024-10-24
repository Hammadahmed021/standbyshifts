import React, { useEffect, useState } from "react";
import { getDataForEmployer } from "../../utils/Api";
import {
  Button,
  CompanyProfiles,
  EmpCard,
  EmpCardSlider,
  JobCard,
} from "../../component";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { girlSofa } from "../../assets";

const Home = () => {
  const { type } = location.state || {}; // Get the type passed from modal
  const [profile, setProfile] = useState([]); // Initialize as null to check loading state
  const [candidateApllied, setCandidateApllied] = useState([]);

  const userData = useSelector((state) => state.auth.userData);
  const userType = userData?.user?.type;

  useEffect(() => {
    const getData = async () => {
      const response = await getDataForEmployer();
      setProfile(response?.data);
      setCandidateApllied(response?.data?.candidates);
    };
    getData();
  }, []);

  const checkLayout = profile?.about?.layout || "1"; // Check layout from profile

  const navigate = useNavigate();
  const handleRoute = () => {
    navigate("/post-job");
  };

  return (
    <>
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

      <div className="bg-tn_light_grey py-16 mb-16 mt-8">
        <div className="flex items-center justify-between container">
          <h3 className="text-tn_dark text-5xl inline sm:block leading-tight font-semibold">
            Recent job posts
          </h3>
          <Link
            to={""}
            className="text-tn_text_grey text-base pointer-events-none"
          >
            View All
          </Link>
        </div>
        <div className="container">
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                userType={userType}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-hero sm:h-auto h-auto sm:mb-24 mb-16 mt-20 bg-no-repeat bg-cover container rounded-site overflow-hidden px-6 py-12">
        <div className="container h-full flex items-center px-0">
          <div className="lg:w-7/12 w-full ">
            <div className="flex flex-col items-ends justify-center px-6 employer">
              <EmpCardSlider data={candidateApllied} />
              {/* <div className="grid grid-cols-3">
                <EmpCard
                  image={candidateApllied?.profile_picture}
                  title={candidateApllied?.designation}
                  employer_name={candidateApllied.name}
                  jobId={candidateApllied?.id}
                />
              </div> */}
            </div>
          </div>
          <div className="lg:w-5/12 w-full flex pl-10 py-0 flex-col justify-evenly h-full">
            <div className="w-[100%] sm:w-[95%]">
              <h3 className="text-white text-4xl inline sm:block leading-tight font-semibold">
                Candidates who applied on your job
              </h3>
              <p className=" my-4 text-base w-full text-white  font-normal sm:text-start text-center">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
              </p>
              <Button
                className="mt-8 pointer-events-none border text-white"
                bgColor="transparent"
              >
                Find more
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <h3 className="text-tn_dark text-4xl inline sm:block leading-tight font-semibold text-center">
          Popular employees
        </h3>
        <p className=" my-4 text-base w-full text-tn_dark  font-normal md:w-[40%] text-center mx-auto">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-8">
          <p>No popular employee available</p>
        </div>
      </div>

      <div className="bg-cta-bg bg-cover bg-no-repeat bg-center rounded-2xl h-[600px] mt-12 mb-8 container flex items-center p-6">
        <div className="w-7/12 pl-0 md:pl-8">
          <div className="w-[100%] sm:w-[85%]">
            <h3 className="text-white text-5xl inline sm:block leading-tight">
              Hire experts &
              <span className="font-bold text-tn_primary inline sm:block">
                Get your job done
              </span>
            </h3>
            <p className=" my-4 text-base w-full text-white  font-normal sm:text-start text-center sm:w-[95%]">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout.
            </p>
            <div className="flex container px-0 space-x-3 mt-10">
              <Button
                onClick={handleRoute}
                className="bg-white text-tn_pink"
                textColor="text-tn_pink"
              >
                Post a Job
              </Button>
            </div>
          </div>
        </div>
        <div className="w-5/12">
          <img src={girlSofa} />
        </div>
      </div>
    </>
  );
};

export default Home;
