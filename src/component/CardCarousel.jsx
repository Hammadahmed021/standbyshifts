import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { WishlistButton } from "../component";
import { fallback } from "../assets";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite } from "../store/favoriteSlice";
import { addFavorite } from "../utils/Api";

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
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);

  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);

  useEffect(() => {
    const fetchData = async () => {
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
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, [id, title, location, images, rating, type, cuisine, timeline]);

  useEffect(() => {
    setInWishlist(favorites.includes(id));
  }, [favorites, id]);

  const isLoggedIn = useSelector((state) => state.auth.userData);

  const handleWishlistClick = async () => {
    if (data) {
      try {
        await addFavorite(data.id); // Toggle favorite status in backend
        dispatch(toggleFavorite(data.id)); // Update local state
        setInWishlist(!inWishlist); // Toggle local state
        alert(inWishlist ? "Removed from favorites!" : "Added to favorites!");
      } catch (error) {
        console.error("Error toggling favorites:", error.message);
      }
    }
  };

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

  const isSingleImage = Array.isArray(data?.images) && data.images.length === 1;

  return (
    <div className="max-w-sm rounded overflow-hidden relative mx-2 mb-6 sm:mb-8">
      {isSingleImage ? (
        <img
          className="w-full h-[329px] object-cover focus-visible:outline-none focus:outline-none rounded-2xl"
          src={data.images[0] || fallback}
          alt={`Slide 1`}
        />
      ) : (
        <Slider {...settings}>
          {data?.images?.map((image, index) => (
            <div key={index}>
              <img
                className="w-full h-[329px] object-cover focus-visible:outline-none focus:outline-none rounded-2xl"
                src={image || fallback}
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </Slider>
      )}
      {isLoggedIn && (
        <div
          className={`absolute top-2 ${
            data.type === "featured" ? "right-5" : "right-2"
          } bg-white rounded-full w-7 h-7 flex items-center justify-center shadow-sm`}
        >
          <WishlistButton
            defaultInWishlist={inWishlist}
            onToggleWishlist={handleWishlistClick}
          />
        </div>
      )}
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
            {data?.timeline?.map((item, index) => (
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
