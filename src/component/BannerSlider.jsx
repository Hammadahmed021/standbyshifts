import React from "react";
import Slider from "react-slick";

function BannerSlider({reverse}) {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 2, // Only one set of two columns (2 images in each column) at a time
    slidesToScroll: 1, // Scroll one set at a time
    vertical: true,
    verticalSwiping: true,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 4000,
    cssEase: "linear",
    pauseOnHover: false,
    pauseOnFocus: false,
    rtl: reverse, // Reverse the direction based on the prop
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://via.placeholder.com/350x400"
            alt="Slide 1"
            className="w-[350px] h-[400px] object-cover rounded-lg"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://via.placeholder.com/350x400"
            alt="Slide 2"
            className="w-[350px] h-[400px] object-cover rounded-lg"
          />
        </div>

        <div className="rounded-lg overflow-hidden">
          <img
            src="https://via.placeholder.com/350x400"
            alt="Slide 3"
            className="w-[350px] h-[400px] object-cover rounded-lg"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://via.placeholder.com/350x400"
            alt="Slide 4"
            className="w-[350px] h-[400px] object-cover rounded-lg"
          />
        </div>

        <div className="rounded-lg overflow-hidden">
          <img
            src="https://via.placeholder.com/350x400"
            alt="Slide 5"
            className="w-[350px] h-[400px] object-cover rounded-lg"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://via.placeholder.com/350x400"
            alt="Slide 6"
            className="w-[350px] h-[400px] object-cover rounded-lg"
          />
        </div>
      </Slider>
    </div>
  );
}

export default BannerSlider;
