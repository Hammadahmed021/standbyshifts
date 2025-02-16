import React from "react";
import Slider from "react-slick";
import EmpCard from "./EmpCard";
import { NextArrow, PrevArrow } from "./CustomArrows";
import { avatar } from "../assets";

const EmpCardSlider = ({ data = [], arrowPosition, slidesToShow = 3 }) => {
  const itemCount = data.length;

  const settings = {
    dots: false,
    infinite: itemCount > 1, // Infinite scroll only if there are more than 1 items
    autoplay: itemCount > 1, // Autoplay only if there are more than 1 items
    speed: 4000,
    autoplaySpeed: 4000,
    pauseOnFocus: false,
    slidesToShow: itemCount < slidesToShow ? itemCount : slidesToShow, // Display all items if less than slidesToShow
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
          slidesToShow: itemCount < 2 ? itemCount : 2, // Show 2 slides on tablet or less if data has fewer items
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
              image={employee.logo || employee.image || employee?.profile_picture || employee?.user?.employer?.logo || avatar}
              title={employee.title || employee?.designation}
              subheading={employee.subheading || employee?.industry}
              employer_name={employee.employer_name || employee.name}
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
