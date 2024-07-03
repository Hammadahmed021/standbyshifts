import React from 'react';
import Slider from 'react-slick';

const Carousel = ({ children, slidesToShow, responsiveSettings }) => {
  const defaultSettings = {
    dots: true,
    infinite: true,
    autoplay: false,
    speed: 500,
    slidesToShow: slidesToShow || 4, // Default to 4 slides
    slidesToScroll: 1,
    appendDots: (dots) => (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul>{dots}</ul>
      </div>
    ),
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: responsiveSettings || [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  const settings = {
    ...defaultSettings,
    ...responsiveSettings, // Override default responsive settings if provided
  };

  return (
    <Slider {...settings} className='featured-carousel max-w-[100%] mx-auto overflow-hidden'>
      {children}
    </Slider>
  );
};

// Custom previous arrow component
const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <button className={`${className} prev-arrow`} onClick={onClick}>
      Previous
    </button>
  );
};

// Custom next arrow component
const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <button className={`${className} next-arrow`} onClick={onClick}>
      Next
    </button>
  );
};

export default Carousel;
