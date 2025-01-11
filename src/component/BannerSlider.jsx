import React from "react";
import Slider from "react-slick";

function BannerSlider({ images, reverse, slidesToShow }) {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: slidesToShow || 2, // Two images at a time in one set
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
    <div className="slider-container ">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="rounded-lg overflow-hidden">
            <img
              src={image.src}
              alt={`Slide ${index + 1}`}
              className="w-[220px] h-[250px] 2xl:h-[400px] 2xl:w-[350px] lg:h-[450px] lg:w-[350px] object-cover rounded-lg my-1"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default BannerSlider;
