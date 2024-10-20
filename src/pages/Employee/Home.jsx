import React, { useEffect, useState } from "react";
import { getJobsForEmployee } from "../../utils/Api";
import {
  Button,
  EmpCardSlider,
  JobCard,
  TestimonialSlider,
} from "../../component";
import { testimonial } from "../../utils/localDB";
import { paypal, peoples } from "../../assets";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "../../component/CustomArrows";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Home = () => {
  const [recentJobs, setRecentJobs] = useState([]);
  const [matchJobs, setMatchJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [employers, setEmployers] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await getJobsForEmployee();
      console.log(response, 'response employee');

      setRecentJobs(response?.data?.matchJobs);
      setMatchJobs(response?.data?.recentMatchedJobs);
      setSkills(response?.data?.skills);
      setEmployers(response?.data?.employers);

    };

    fetchJobs();
  }, []);

  const sliderSettings = {
    dots: false, // Remove dots, show only arrows
    infinite: true,
    speed: 500,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // 3 seconds between slides
    slidesToShow: 3, // Default to 3 slides for desktop
    slidesToScroll: 1,
    nextArrow: (
      <NextArrow
        style={{
          right: "-25px",
          top: "50%", // Allow custom top position
          bottom: "50%", // Allow custom bottom position
          left: "-25px", // Allow custom left position
          zIndex: 1, // Control zIndex if needed
          position: "absolute", // Control position if needed
        }}
      />
    ),
    prevArrow: (
      <PrevArrow
        style={{
          right: "-25px",
          top: "50%", // Allow custom top position
          bottom: "50%", // Allow custom bottom position
          left: "-25px", // Allow custom left position
          zIndex: 1, // Control zIndex if needed
          position: "absolute", // Control position if needed
        }}
      />
    ),
    responsive: [
      {
        breakpoint: 1024, // Tablet breakpoint
        settings: {
          slidesToShow: 2, // Show 2 slides on tablets
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
  const navigate = useNavigate()
  const handleRoute = () => {
    navigate('/jobs')
  }
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
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
              </p>
              <div className="flex container px-0 space-x-3 mt-10">
                <Button
                onClick={handleRoute}
                >
                  Search
                </Button>

              </div>
            </div>
            <div>
              <p className="text-white font-base">Popular searches:</p>
              <ul className="flex flex-wrap space-x-3 custom-icons mt-4">
                {skills.slice(0, 6).map((item) => (
                  <li key={item.id}>
                    <span className="text-tn_light rounded-site text-sm bg-tn_text_grey px-3 py-1 flex items-center justify-between">
                      <FaMagnifyingGlass size={13} className="mr-2" /> {item.title}
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

          <h3 className="text-tn_dark text-5xl inline sm:block leading-tight font-semibold">
            Recent job posts
          </h3>
          <div className="flex item-center justify-between">
            <ul className="flex flex-wrap space-x-3 custom-icons mt-4">
              {skills.slice(0, 6).map((item) => (
                <li key={item.id}>
                  <span className="text-tn_dark rounded-site text-sm border border-tn_dark px-3 py-1 flex items-center justify-between">
                    <FaMagnifyingGlass size={13} className="mr-2" /> {item.title}
                  </span>
                </li>
              ))}
            </ul>
            <Link to={''} className="text-tn_text_grey text-base">View All</Link>
          </div>

        </div>
        <Slider {...sliderSettings} className="mt-12">
          {matchJobs?.map((job) => (
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
              />
            </div>
          ))}
        </Slider>
      </div>

      <div className="bg-hero sm:h-auto h-auto sm:mb-24 mb-16 mt-20 bg-no-repeat bg-cover container rounded-site overflow-hidden px-0 py-6">
        <div className="container h-full flex items-center px-0">
          <div className="lg:w-5/12 w-full flex pl-10 py-0 flex-col justify-evenly h-full">
            <div className="w-[100%] sm:w-[95%]">
              <h3 className="text-white text-5xl inline sm:block leading-tight font-semibold">
                Jobs that match your profile
              </h3>
              <p className=" my-4 text-base w-full text-white  font-normal sm:text-start text-center">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
              </p>
              <Button className="mt-8">Find more</Button>
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
        <h3 className="text-tn_dark text-5xl inline sm:block leading-tight font-semibold text-center">
          Who's hiring on standby shifts
        </h3>
        <p className=" my-4 text-base w-full text-tn_dark  font-normal md:w-[40%] text-center mx-auto">
          It is a long established fact that a reader will be distracted
          by the readable content of a page when looking at its layout.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {employers?.map((item, index) => (
            <>
              <span className="p-4 bg-white shadow-lg rounded-2xl flex items-center justify-center">
                <img key={index} src={item} className="w-28 h-28 object-contain" alt={`Employer ${index}`} />
              </span>
            </>
          ))}
        </div>

      </div>

      <div className="bg-nearby-bg my-24 bg-cover py-8">
        <div className="container pt-24 pb-10">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-5xl inline sm:block leading-tight font-semibold text-center">
              Jobs near you
            </h3>
            <Link to={''} className="bg-tn_primary px-6 py-2 rounded-site text-white font-medium">Find more</Link>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-1">
          {matchJobs?.splice(0,3)?.map((job) => (
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
            <h3 className="text-tn_dark text-5xl inline sm:block leading-tight font-semibold">
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
