import React, { useEffect, useState } from "react";
import { getJobsForEmployee } from "../../utils/Api";
import {
  Button,
  EmpCardSlider,
  Input,
  JobCard,
  TestimonialSlider,
} from "../../component";
import { testimonial } from "../../utils/localDB";
import { paypal, peoples } from "../../assets";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "../../component/CustomArrows";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const [recentJobs, setRecentJobs] = useState([]);
  const [matchJobs, setMatchJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [employers, setEmployers] = useState([]);

  const userData = useSelector((state) => state.auth.userData);
  const userType = userData?.user?.type;

  console.log(recentJobs, "recentJobs");

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await getJobsForEmployee();
      setRecentJobs(response?.data?.matchJobs);
      setMatchJobs(response?.data?.recentMatchedJobs);
      setSkills(response?.data?.skills);
      setEmployers(response?.data?.employers);
    };

    fetchJobs();
  }, []);

  console.log(matchJobs, 'matchJobs>>>>>>>>>>>>>>>>>>');
  

  const getSliderSettings = (items = []) => {
    const itemCount = items.length;
  
    return {
      dots: false,
      infinite: itemCount > 1, // Disable infinite scroll if only 1 item
      speed: 500,
      autoplay: itemCount > 1, // Disable autoplay if only 1 item
      autoplaySpeed: 3000, // 3 seconds between slides
      slidesToShow: itemCount < 3 ? itemCount : 3, // Show as many slides as available or default to 3
      slidesToScroll: 1,
      nextArrow: (
        <NextArrow
          style={{
            right: "-25px",
            top: "50%",
            zIndex: 1,
            position: "absolute",
          }}
        />
      ),
      prevArrow: (
        <PrevArrow
          style={{
            left: "-25px",
            top: "50%",
            zIndex: 1,
            position: "absolute",
          }}
        />
      ),
      responsive: [
        {
          breakpoint: 1024, // Tablet breakpoint
          settings: {
            slidesToShow: itemCount < 2 ? itemCount : 2, // Show 1 or 2 slides on tablet depending on available items
          },
        },
        {
          breakpoint: 768, // Mobile breakpoint
          settings: {
            slidesToShow: 1, // Show 1 slide on mobile
          },
        },
      ],
    };
  };
  
  const navigate = useNavigate();
  const handleRoute = () => {
    navigate("/jobs");
  };
  return (
    <>
      <div className="bg-hero sm:h-[650px] h-[450px] sm:mb-16 mb-12 mt-2 bg-no-repeat bg-cover container rounded-site overflow-hidden px-0">
        <div className="container h-full flex items-center sm:items-end px-0 ">
          <div className="w-full flex pl-10 py-0 flex-col justify-evenly h-full">
            <div className="w-[100%] sm:w-[85%]">
              <h2 className="text-white text-6xl inline sm:block leading-tight">
                Discover the ideal
                <span className="font-bold text-tn_primary inline sm:block">
                  match for professional needs
                </span>
              </h2>
              <p className=" my-4 text-base w-full text-white  font-normal sm:text-start text-center sm:w-[95%]">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
              </p>
              <div className="flex container px-0 space-x-3 mt-10">
                <input
                  label="Search by title"
                  placeholder="Search by title"
                  type="text"
                  className="rounded-site w-[30%] pl-4"
                />
                <Button onClick={handleRoute}>Search</Button>
              </div>
            </div>
            <div>
              <p className="text-white font-base">Popular searches:</p>
              <ul className="flex flex-wrap space-x-3 custom-icons mt-4">
                {skills.slice(0, 6).map((item) => (
                  <li key={item.id}>
                    <span className="text-tn_light rounded-site text-sm bg-tn_text_grey px-3 py-1 flex items-center justify-between">
                      <FaMagnifyingGlass size={13} className="mr-2" />{" "}
                      {item.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-24 employee-home px-0">
        <div className="container">
          <h3 className="text-tn_dark text-4xl inline sm:block leading-tight font-semibold">
            Recent job posts
          </h3>
          <div className="flex item-center justify-between">
            <ul className="flex flex-wrap space-x-3 custom-icons mt-4">
              {skills.slice(0, 6).map((item) => (
                <li key={item.id}>
                  <span className="text-tn_dark rounded-site text-sm border border-tn_light_grey px-3 py-1 flex items-center justify-between">
                    <FaMagnifyingGlass size={13} className="mr-2" />
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>
            <Link to={"/jobs"} className="text-tn_text_grey text-base">
              View All
            </Link>
          </div>
        </div>
        <Slider {...getSliderSettings(matchJobs)} className="mt-12">
          {!matchJobs || matchJobs.length === 0
            ? // Show skeleton loaders for the number of jobs you expect to show
              [...Array(3)].map((_, index) => (
                <div key={index} className="p-2">
                  <JobCard loading={true} /> {/* Loader JobCard */}
                </div>
              ))
            : matchJobs?.map((job) => (
                <div key={job?.id} className="p-2">
                  <JobCard
                    jobId={job?.id}
                    key={job?.id}
                    companyLogo={job?.user?.employer?.logo} // Replace with actual logo
                    jobTitle={job?.title}
                    companyName={job?.city} // You can also pass the company name if available
                    payRate={`$${job?.per_hour_rate}`}
                    dateRange={`${new Date(
                      job?.start_date
                    ).toLocaleDateString()} to ${new Date(
                      job?.end_date
                    ).toLocaleDateString()}`}
                    timeRange={`${job?.shift_start_time} - ${job?.shift_end_time}`}
                    level={job?.experience_level}
                    address={`${job?.location}, ${job?.state}`}
                    description={job?.description}
                    userType={userType}
                    loading={false}
                    applicants={job?.applicant} 
                  />
                </div>
              ))}
        </Slider>
      </div>

      <div className="bg-hero sm:h-auto h-auto sm:mb-24 mb-16 mt-20 bg-no-repeat bg-cover container rounded-site overflow-hidden px-0 py-6">
        <div className="container h-full flex items-center px-0">
          <div className="lg:w-5/12 w-full flex pl-10 py-0 flex-col justify-evenly h-full">
            <div className="w-[100%] sm:w-[95%]">
              <h3 className="text-white text-4xl inline sm:block leading-tight font-semibold">
                Jobs that match your profile
              </h3>
              <p className=" my-4 text-base w-full text-white  font-normal sm:text-start text-center">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
              </p>
              <Button className="mt-8 pointer-events-none">Find more</Button>
            </div>
          </div>
          <div className="lg:w-7/12 w-full ">
            <div className="flex flex-col items-ends justify-center px-6 employer">
              <EmpCardSlider data={recentJobs} />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <h3 className="text-tn_dark text-4xl inline sm:block leading-tight font-semibold text-center">
          Who's hiring on standby shifts
        </h3>
        <p className=" my-4 text-base w-full text-tn_dark  font-normal md:w-[40%] text-center mx-auto">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {employers?.map((item, index) => (
            <>
              <span className="p-4 bg-white shadow-lg rounded-2xl flex items-center justify-center">
                <img
                  key={index}
                  src={item}
                  className="w-28 h-28 object-contain"
                  alt={`Employer ${index}`}
                />
              </span>
            </>
          ))}
        </div>
      </div>

      <div className="bg-nearby-bg my-24 bg-cover py-8">
        <div className="container pt-20 pb-10">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-4xl inline sm:block leading-tight font-semibold text-center">
              Jobs near you
            </h3>
            <Link
              to={"/jobs"}
              className="bg-tn_primary px-8 py-3 rounded-site text-white font-medium"
            >
              Find more
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-1">
            {!matchJobs || matchJobs.length === 0
              ? // Show skeleton loaders for the number of jobs you expect to show
                [...Array(3)].map((_, index) => (
                  <div key={index} className="p-2">
                    <JobCard loading={true} /> {/* Loader JobCard */}
                  </div>
                ))
              : matchJobs?.splice(0, 3)?.map((job) => (
                  <div key={job?.id} className="p-2">
                    <JobCard
                      jobId={job?.id}
                      key={job?.id}
                      companyLogo={job?.user?.employer?.logo} // Replace with actual logo
                      jobTitle={job?.title}
                      companyName={job?.city} // You can also pass the company name if available
                      payRate={`$${job?.per_hour_rate}`}
                      dateRange={`${new Date(
                        job?.start_date
                      ).toLocaleDateString()} to ${new Date(
                        job?.end_date
                      ).toLocaleDateString()}`}
                      timeRange={`${job?.shift_start_time} - ${job?.shift_end_time}`}
                      level={job?.experience_level}
                      location={`${job?.location}, ${job?.state}`}
                      description={job?.description}
                      userType={userType}
                      loading={false}
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>

      <div className="container flex items-center my-20 testimonials">
        <div className="lg:w-5/12 w-full">
          <img src={peoples} alt="" />
        </div>
        <div className="lg:w-7/12 w-full ">
          <div className="text-start w-full lg:w-[65%] mx-auto">
            <h3 className="text-tn_dark text-4xl inline sm:block leading-tight font-semibold">
              Trusted by people all over
            </h3>
            <TestimonialSlider data={testimonial} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
