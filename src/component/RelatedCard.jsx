import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { WishlistButton } from "../component";
import { relatedFallback } from "../assets";

const SkeletonLoader = () => {
  return (
    <div className="max-w-sm rounded overflow-hidden relative mx-2 mb-6 sm:mb-8 animate-pulse">
      <div className="w-full h-[329px] bg-gray-300 rounded-2xl"></div>
      <div className="px-2 py-2"></div>
    </div>
  );
};

const RelatedCard = ({
  id,
  title,
  location,
  images = [],
  type,
  cuisine,
  timeline,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call with setTimeout
      setTimeout(() => {
        setData({
          id,
          title,
          location,
          images: images.length ? images : [relatedFallback], // Use fallback image if images array is empty

          type,
          cuisine,
          timeline,
        });
        setLoading(false);
      }, 2000);
    };

    fetchData();
  }, [id, title, location, images, type, cuisine, timeline]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "5px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul>{dots.slice(0, 5)}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#fff",
        }}
      ></div>
    ),
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  const isSingleImage = Array.isArray(data?.images) && data.images.length === 1;

  return (
    <div className="max-w-sm rounded overflow-hidden relative mx-2 mb-6 sm:mb-8">
      {isSingleImage ? (
        <img
          className="w-full h-[329px] object-cover focus-visible:outline-none focus:outline-none rounded-2xl"
          src={data.images[0]}
          alt={`Slide 1`}
        />
      ) : (
        <Slider {...settings}>
          {data.images.map((image, index) => (
            <div key={index}>
              <img
                className="w-full h-[329px] object-cover focus-visible:outline-none focus:outline-none rounded-2xl"
                src={image}
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </Slider>
      )}

      {/* <div className="absolute top-2 right-5 bg-white rounded-full w-7 h-7 flex items-center justify-center">
        <WishlistButton />
      </div> */}

      <div className="px-2 py-2 absolute bottom-0 left-0 w-full z-10">
        <p className="text-white text-base">{data.location}</p>
        <div className="font-bold text-2xl mb-2 text-white ">
          <Link to={`/restaurant/${data.id}`} className="hover:opacity-80">
            {data.title}
          </Link>
        </div>
      </div>
    </div>
  );
};
export default RelatedCard;
