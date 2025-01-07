import React, { useEffect, useState } from "react";
import { GetComOrEmp, getDataForEmployer } from "../../utils/Api";
import {
  Button,
  CompanyProfiles,
  EmpCard,
  EmpCardSlider,
  JobCard,
} from "../../component";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fallback, girlSofa } from "../../assets";
import { employees } from "../../utils/localDB";
import LayoutCards from "../../component/Employer/LayoutCards";

const Home = () => {
  const { type } = location.state || {}; // Get the type passed from modal
  const [profile, setProfile] = useState([]); // Initialize as null to check loading state
  const [candidateApllied, setCandidateApllied] = useState([]);
  const [getDetails, setGetDetails] = useState([]);

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
  console.log(candidateApllied, "candidateApllied");

  const navigate = useNavigate();
  const handleRoute = () => {
    navigate("/post-job");
  };

  const FuckinType = "employee";
  useEffect(() => {
    const getAllCompany = async (userType) => {
      try {
        const response = await GetComOrEmp(userType);
        console.log(response, "getting data based on type", userType);
        setGetDetails(response);
      } catch (error) {
        console.log(error, "unable to get data");
      }
    };
    getAllCompany(FuckinType);
  }, []);

  const transformedProfiles = getDetails.map((job) => ({
    bannerImg: job?.banner || fallback, // Fallback banner image
    image: job?.employee?.image || fallback, // Fallback logo image
    title: job?.name || "No Title Provided",
    description: job?.short_description || "No Description Available",
    location: job?.employee?.location || "Location Not Available",
    layout: job?.layout || "1", // Default layout
    id: job?.id, // Default layout if not provided
  }));

  return (
    <>
      <div className="bg-hero sm:h-[650px] h-auto sm:mb-16 mb-12 mt-2 bg-no-repeat bg-cover container rounded-site overflow-hidden px-0">
        <div className="container h-full flex sm:items-end p-6 sm:px-4 ">
          <div className="w-full  py-0 flex-col h-full">
            <div className="container flex flex-col lg:flex-row items-end justify-between sm:pt-10">
              <div className="">
                <h2 className="text-white text-4xl sm:text-6xl inline sm:block leading-tight">
                  Discover the ideal{" "}
                  <span className="font-bold text-tn_primary inline sm:block">
                    match for staffing needs
                  </span>
                </h2>
                <p className=" my-4 text-base w-full text-white  font-normal text-start sm:w-[95%]">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </p>
              </div>
              <Link
                to={"/companies"}
                className="border px-8 py-3 rounded-site text-white font-medium hidden sm:block"
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container md:-mt-[350px] lg:-mt-[400px] sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {transformedProfiles?.slice(0, 4)?.map((profile, index) => (
            <LayoutCards
              key={index}
              profile={profile}
              layout={profile.layout}
              type={FuckinType}
            />
          ))}
        </div>
      </div>

      <div className=" py-8 sm:py-16 mb-16 mt-8">
        <div className="flex items-center justify-between container">
          <h3 className="text-tn_dark text-4xl sm:text-5xl inline sm:block leading-tight font-semibold">
            Recent shift posts
          </h3>
          <Link
            to={"/appliers-on-job"}
            className="text-tn_text_grey text-base cursor-pointer"
          >
            View All
          </Link>
        </div>
        <div className="container">
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {profile?.jobsPostedByYou?.slice(0, 6)?.map((job) => (
              <JobCard
                className={"shadow-xl"}
                key={job.id}
                jobId={job.id}
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
                btnText={true}
                onClickToEdit={() => {
                  navigate(`/post-job`, {
                    state: job,
                  });
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-hero sm:h-auto h-auto sm:mb-24 mb-16 mt-20 bg-no-repeat bg-cover container rounded-site overflow-hidden px-6 py-8 sm:py-12">
        <div className="container h-full flex flex-wrap flex-col-reverse sm:flex-row items-center px-0">
          <div className="lg:w-7/12 w-full">
            <div className="flex flex-col items-ends justify-center px-4 sm:px-6 employer">
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
          <div className="lg:w-5/12 w-full flex pl-0 sm:pl-10 py-0 flex-col justify-evenly h-full">
            <div className="w-[100%] sm:w-[95%]">
              <h3 className="text-white text-4xl inline sm:block leading-tight font-semibold">
                Candidates who applied on your shift
              </h3>
              <p className=" my-4 text-base w-full text-white  font-normal text-start">
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
        <h3 className="text-tn_dark text-3xl sm:text-4xl inline sm:block leading-tight font-semibold text-center">
          Rated Shift Seekers
        </h3>
        <p className=" my-4 text-base w-full text-tn_dark  font-normal md:w-[40%] text-center mx-auto">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {candidateApllied?.map((employee) => (
            <EmpCard
              image={employee.image || employee?.profile_picture}
              title={employee.title || employee?.designation}
              subheading={employee.subheading}
              employer_name={employee.employer_name || employee.name}
              location={employee.location}
              isLocation={true}
              jobId={employee?.id}
            />
          ))}
        </div>
      </div>

      <div className="bg-cta-bg bg-cover bg-no-repeat bg-center rounded-2xl h-auto sm:h-[600px] mt-12 container flex flex-wrap mb-10  items-center p-6">
        <div className="w-full sm:w-7/12 pl-0 md:pl-8 pt-8 sm:pt-0">
          <div className="w-[100%] sm:w-[85%]">
            <h3 className="text-white text-4xl sm:text-5xl inline sm:block leading-tight">
              Hire experts &{" "}
              <span className="font-bold text-tn_primary inline sm:block">
                Get your shift done
              </span>
            </h3>
            <p className=" my-4 text-base w-full text-white  font-normal text-start sm:w-[95%]">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout.
            </p>
            <div className="flex container px-0 space-x-3 mt-10">
              <Button
                onClick={handleRoute}
                className="bg-white text-tn_pink"
                textColor="text-tn_pink"
              >
                Post a Shift
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-5/12">
          <img src={girlSofa} />
        </div>
      </div>
    </>
  );
};

export default Home;
