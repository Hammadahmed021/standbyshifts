import React from "react";
import Slider from "react-slick";

const TestimonialSlider = ({ data }) => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 4000,
    pauseOnFocus: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: i => (
      <div className="custom-dot"></div>  // Custom dot div for styling
    ),
    dotsClass: "slick-dots custom-dots",  // Use custom class for slick dots
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="p-0">
      <Slider {...settings}>
        {data.map((item, index) => (
          <div key={index} className="px-2 pt-2 pb-8">
            <p>{item.text}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TestimonialSlider;
