import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { WishlistButton } from "../component";

// Skeleton Loader Component
const SkeletonLoader = () => {
  return (
    <div className="max-w-sm rounded overflow-hidden relative mx-2 mb-6 sm:mb-8 animate-pulse">
      <div className="w-full h-[329px] bg-gray-300 rounded-2xl"></div>
      <div className="px-2 py-2">
        <div className="bg-gray-300 h-6 w-3/4 mb-2 rounded"></div>
        <div className="bg-gray-300 h-6 w-1/2 mb-2 rounded"></div>
        <div className="bg-gray-300 h-4 w-1/3 rounded"></div>
      </div>
    </div>
  );
};

const CardCarousel = ({
  id,
  title,
  location,
  images,
  rating,
  type,
  cuisine,
  timeline,
}) => {
  const [data, setData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Simulate fetching data from an API
  useEffect(() => {
    // Replace this with your actual API call
    const fetchData = async () => {
      // Simulate API call with setTimeout
      setTimeout(() => {
        setData({
          id,
          title,
          location,
          images,
          rating,
          type,
          cuisine,
          timeline,
        });
        setLoading(false); // Set loading to false once data is fetched
      }, 1000);
    };

    fetchData();
  }, [id, title, location, images, rating, type, cuisine, timeline]);

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
        <ul> {dots.slice(0, 5)} </ul>
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

  // const isSingleImage = data.images.length === 1;
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
      {/* {data.type === "featured" ? (
        <div className="absolute top-2 right-5 bg-white rounded-full w-7 h-7 flex items-center justify-center">
          <WishlistButton />
        </div>
      ) : (
        <div className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center">
          <WishlistButton />
        </div>
      )} */}
      {data.type === "featured" && (
        <div className="px-2 py-2 absolute bottom-0 left-0 w-full z-10">
          <p className="text-white text-base">{data.location}</p>
          <div className="font-bold text-2xl mb-2 text-white ellipsis-2-lines">
            <Link to={`/restaurant/${data.id}`} className="hover:opacity-80">
              {data.title}
            </Link>
          </div>
        </div>
      )}
      {!data.type && (
        <div className="px-2 py-2">
          <div className="flex justify-between items-center">
            <p className="text-black text-sm font-medium ellipsis mr-1">
              {data.location}
            </p>
            {/* <Ratings rating={data.rating} /> */}
          </div>
          <div
            className="font-bold text-md text-tn_dark ellipsis"
            style={{ maxWidth: "100%" }}
          >
            <Link to={`/restaurant/${data.id}`} className="hover:opacity-80">
              {data.title}
            </Link>
          </div>
          <p className="text-black text-sm font-light">{data.cuisine}</p>
          <ul className="flex items-center mt-1">
            {data.timeline.map((item, index) => (
              <li className="text-black text-sm font-medium" key={index}>
                {item}
                {index < data.timeline.length - 1 && <span>,&nbsp;</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CardCarousel;
