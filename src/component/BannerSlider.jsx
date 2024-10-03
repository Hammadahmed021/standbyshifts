import React from "react";
import Slider from "react-slick";

function BannerSlider({ images, reverse }) {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 2, // Two images at a time in one set
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
          <div key={index} className="rounded-lg overflow-hidden ">
            <img
              src={image.src}
              alt={`Slide ${index + 1}`}
              className="w-[350px] h-[400px] object-cover rounded-lg"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default BannerSlider;
