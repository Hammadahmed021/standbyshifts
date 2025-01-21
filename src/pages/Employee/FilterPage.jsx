import React, { useEffect, useState } from "react";
import { getJobsForEmployee } from "../../utils/Api";
import {
  Button,
  EmpCardSlider,
  Input,
  JobCard,
  SelectOption,
  TestimonialSlider,
} from "../../component";
import { testimonial } from "../../utils/localDB";
import { fallback, paypal, peoples } from "../../assets";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "../../component/CustomArrows";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LayoutCards from "../../component/Employer/LayoutCards";

const FilterPage = () => {
  const [recentJobs, setRecentJobs] = useState([]);
  const [matchJobs, setMatchJobs] = useState([]);
  const [expertise, setExpertise] = useState([]);
  const [skills, setSkills] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [industries, setIndustries] = useState([]);
  // const [shifts, setShifts] = useState([]);
  const [start_date, setStart_date] = useState([]);

  const shiftTimes = [
    { id: "morning", name: "Morning" },
    { id: "afternoon", name: "Afternoon" },
    { id: "evening", name: "Evening" },
    { id: "night", name: "Night" },
  ];

  const [selectedOptions, setSelectedOptions] = useState({
    // industries: null,
    shifts: shiftTimes,
    expertise: null,
    jobTitle: null,
    zipCode: null,
    location: null,
    start_date: null,
  });

  const handleFilterChange = (e, category) => {
    const value = Array.isArray(e.target.value)
      ? e.target.value
      : [e.target.value]; // Ensure it's an array

    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [category]: value,
    }));
  };

  const userData = useSelector((state) => state.auth.userData);
  const userType = userData?.user?.type || userData?.type;

  console.log(recentJobs, "recentJobs");

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await getJobsForEmployee();
      console.log(
        "responseresponseresponseresponseresponseresponseresponse",
        response
      );
      setRecentJobs(response?.data?.matchJobs);
      setMatchJobs(response?.data?.recentMatchedJobs);
      setExpertise(response?.data?.expertise);
      setSkills(response?.data?.skills);
      setEmployers(response?.data?.employers);
      setStart_date(response?.data?.start_date);
      // setIndustries(response?.data?.industries);
    };

    fetchJobs();
  }, []);

  console.log(matchJobs, "matchJobs>>>>>>>>>>>>>>>>>>");

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

  const addAllOption = (options, label) => [
    { id: "all", name: label },
    ...options,
  ];

  const navigate = useNavigate();
  const handleRoute = () => {
    navigate("/jobs", { state: selectedOptions });
  };

  const transformedProfiles = matchJobs.map((job) => ({
    bannerImg: job?.user?.banner || fallback, // Fallback banner image
    image: job?.user?.employer?.image || fallback, // Fallback logo image
    title: job?.title || "No Title Provided",
    description: job?.description || "No Description Available",
    location: job?.location || "Location Not Available",
    layout: job?.user?.layout || "1", // Default layout if not provided
    id: job?.id, // Default layout if not provided
  }));

  return (
    <>
      <div className="bg-hero sm:h-[650px] h-auto sm:mb-16 mb-12 mt-2 bg-no-repeat bg-cover container rounded-site overflow-hidden px-0">
        <div className="container h-full flex items-center sm:items-end p-6 sm:px-0 ">
          <div className="w-full flex sm:pl-10 py-0 flex-col justify-evenly h-full">
            <div className="w-[100%] sm:w-[90%]">
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
              <div className="flex flex-wrap sm:flex-nowrap container px-0  mt-10 gap-3">
                <div className="flex flex-wrap sm:flex-nowrap gap-2 rounded-2xl sm:rounded-site border py-3 px-4">
                  <SelectOption
                    // label="Expertise"
                    pl={"pl-1"}
                    value={selectedOptions.expertise}
                    onChange={(e) => handleFilterChange(e, "expertise")}
                    className="border-b sm:border-b-0 sm:border-r  sm:pr-1 py-2"
                    options={addAllOption(expertise || [], "All Expertise")}
                  />
                  <SelectOption
                    // label="Industries"
                    pl={"pl-1"}
                    value={selectedOptions.shifts}
                    onChange={(e) => handleFilterChange(e, "shifts")}
                    className="border-b sm:border-b-0 sm:border-r pr-1 py-2"
                    options={addAllOption(shiftTimes || [], "All shifts")}
                  />

                  <input
                    label="Search by title"
                    placeholder="Job title"
                    type="text"
                    className="w-[100%]  bg-transparent border-b sm:border-b-0 sm:border-r pr-1 py-2 outline-none focus:outline-none text-white"
                    value={selectedOptions.jobTitle}
                    onChange={(e) => {
                      setSelectedOptions((prevSelectedOptions) => ({
                        ...prevSelectedOptions,
                        jobTitle: e.target.value,
                      }));
                    }}
                  />
                  <input
                    className="w-[100%] bg-transparent border-b sm:border-b-0 sm:border-r pr-1 py-2 outline-none focus:outline-none text-white"
                    type="date"
                    value={selectedOptions.start_date}
                    onChange={(e) => {
                      setSelectedOptions((prevSelectedOptions) => ({
                        ...prevSelectedOptions,
                        start_date: e.target.value,
                      }));
                    }}
                    placeholder="Enter start date"
                  />

                  <input
                    label="Search by Zipcode"
                    placeholder="Zipcode"
                    type="text"
                    className="w-[100%] bg-transparent border-b sm:border-b-0 sm:border-r pr-1 py-2 outline-none focus:outline-none text-white"
                    value={selectedOptions.zipCode}
                    onChange={(e) => {
                      setSelectedOptions((prevSelectedOptions) => ({
                        ...prevSelectedOptions,
                        zipCode: e.target.value,
                      }));
                    }}
                  />
                  <input
                    label="Search by location"
                    placeholder="Location"
                    type="text"
                    className="w-[100%]  bg-transparent py-2 outline-none focus:outline-none text-white"
                    value={selectedOptions.location}
                    onChange={(e) => {
                      setSelectedOptions((prevSelectedOptions) => ({
                        ...prevSelectedOptions,
                        location: e.target.value,
                      }));
                    }}
                  />
                </div>
                <Button onClick={handleRoute}>Search</Button>
              </div>
            </div>
            <div className="mt-6 sm:mt-0">
              <p className="text-white font-base">Popular searches:</p>
              <ul className="flex flex-wrap gap-2 custom-icons mt-4">
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

      <div className="container mt-24 employee-home">
        <div className="flex flex-wrap items-center justify-center sm:justify-between">
          <h3 className="text-tn_dark text-3xl sm:text-4xl inline sm:block leading-tight font-semibold text-start sm:text-center">
            Nearby available shifts
          </h3>
          <Link
            to={"/jobs"}
            className="text-tn_text_grey text-base hidden sm:block"
          >
            Find more
          </Link>
        </div>
        <div className="mt-6 px-6">
          <Slider {...getSliderSettings(matchJobs)} className="mt-12">
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
                      className={"shadow-xl"}
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
          </Slider>
        </div>
        <div className="text-center pb-12 mt-6 sm:hidden">
          <Link
            to={"/jobs"}
            className="text-tn_text_grey text-base block sm:hidden"
          >
            Find more
          </Link>
        </div>
      </div>

      <div className="container my-24  px-0">
        <div className="container flex flex-wrap flex-col-reverse sm:flex-row item-center justify-between">
          <h3 className="text-tn_dark text-3xl sm:text-4xl inline sm:block leading-tight font-semibold">
            Recently posted shifts
          </h3>

          <Link to={"/jobs"} className="text-tn_text_grey text-base">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {!recentJobs || recentJobs.length === 0
            ? [...Array(3)].map((_, index) => (
                <div key={index} className="p-2">
                  <JobCard loading={true} />
                </div>
              ))
            : recentJobs?.map((job) => (
                <div key={job?.id} className="">
                  <JobCard
                    className={"shadow-xl"}
                    jobId={job?.id}
                    key={job?.id}
                    companyLogo={job?.user?.employer?.logo}
                    jobTitle={job?.title}
                    companyName={job?.city}
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
        </div>
      </div>

      {/* <div className="bg-hero sm:h-auto h-auto sm:mb-24 mb-16 mt-20 bg-no-repeat bg-cover container rounded-site overflow-hidden px-0 py-6">
        <div className="container h-full flex flex-wrap items-center px-0">
          <div className="lg:w-5/12 w-full flex px-4 sm:pl-10 py-0 flex-col justify-evenly h-full">
            <div className="w-[100%] sm:w-[95%]">
              <h3 className="text-white text-4xl inline sm:block leading-tight text-center  font-semibold">
                Jobs that match your profile
              </h3>
              <p className="my-4 text-base w-full text-white  font-normal text-start ">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
              </p>
              <Button className="mt-2 sm:mt-8 pointer-events-none">
                Find more
              </Button>
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
      </div> */}
    </>
  );
};

export default FilterPage;
