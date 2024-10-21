import React from "react";
import Slider from "react-slick";
import EmpCard from "./EmpCard";
import { NextArrow, PrevArrow } from "./CustomArrows";

const EmpCardSlider = ({ data, arrowPosition, slidesToShow }) => {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 4000,
    // cssEase: "linear",
    // pauseOnHover: false,
    pauseOnFocus: false,
    slidesToShow: slidesToShow || 3, // Default to show 3 slides on desktop
    slidesToScroll: 1,
    nextArrow: (
      <NextArrow
        style={{
          right: arrowPosition?.right || "-25px",
          top: arrowPosition?.top || "50%", // Allow custom top position
          bottom: arrowPosition?.bottom || "50%", // Allow custom bottom position
          left: arrowPosition?.left || "-25px", // Allow custom left position
          zIndex: arrowPosition?.zIndex || 1, // Control zIndex if needed
          position: arrowPosition?.position || "absolute", // Control position if needed
        }}
      />
    ),
    prevArrow: (
      <PrevArrow
        style={{
            right: arrowPosition?.right || "-25px",
            top: arrowPosition?.top || "50%", // Allow custom top position
            bottom: arrowPosition?.bottom || "50%", // Allow custom bottom position
            left: arrowPosition?.left || "-25px", // Allow custom left position
            zIndex: arrowPosition?.zIndex || 1, // Control zIndex if needed
            position: arrowPosition?.position || "absolute", // Control position if needed
        }}
      />
    ),
    responsive: [
      {
        breakpoint: 1024, // Tablet breakpoint
        settings: {
          slidesToShow: 2, // Show 2 slides on tablet
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
    <div className="p-0">
      <Slider {...settings}>
        {data.map((employee, index) => (
          <div key={index} className="px-2 py-12">
            <EmpCard
              image={employee.image || employee?.profile_picture}
              title={employee.title || employee?.designation   }
              subheading={employee.subheading}
              employer_name={employee.employer_name || employee.name }
              rating={employee.rating}
              jobId={employee?.id}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default EmpCardSlider;
