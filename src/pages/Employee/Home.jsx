import React, { useEffect, useState } from "react";
import { getJobsForEmployee } from "../../utils/Api";
import {
  Button,
  EmpCardSlider,
  JobCard,
  TestimonialSlider,
} from "../../component";
import { testimonial } from "../../utils/localDB";
import { peoples } from "../../assets";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "../../component/CustomArrows";

const Home = () => {
  const [recentJobs, setRecentJobs] = useState([]);
  const [matchJobs, setMatchJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await getJobsForEmployee();
      setRecentJobs(response?.data?.matchJobs);
      setMatchJobs(response?.data?.recentMatchedJobs);
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

  return (
    <>
      <div className="container mt-16 employee-home px-0">
        <Slider {...sliderSettings}>
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
      <div className="bg-hero sm:h-auto h-auto sm:mb-24 mb-16 mt-16 bg-no-repeat bg-cover container rounded-site overflow-hidden px-0 py-6">
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
