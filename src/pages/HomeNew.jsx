import React, { useState, useEffect } from "react";
import useMediaQuery from "../hooks/useQuery";
import {
  Button,
  CardCarousel,
  LoadMore,
  Carousel,
  Search,
  Filter,
  Loader,
  Modal,
  AuthModal,
} from "../component";
import {
  Fav,
  App,
  storeBtn,
  paypal,
  google,
  payoneer,
  meta,
  netflix,
  png,
} from "../assets";
import { localDB } from "../utils/localDB";
import useFetch from "../hooks/useFetch";
import { transformData, getDistance } from "../utils/HelperFun";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchUserNearByRestaurants, verifyUser } from "../utils/Api";
import { app } from "../service/firebase";
import { Capacitor } from "@capacitor/core";
import BannerSlider from "../component/BannerSlider";

export default function HomeNew() {
  const isDesktop = useMediaQuery("(max-width: 991px)");
  const userData = useSelector((state) => state.auth.userData);

  const [visibleCards, setVisibleCards] = useState(4);
  const [visibleAllCards, setVisibleAllCards] = useState(4);
  const [visibleFeatureCards, setVisibleFeatureCards] = useState(4);
  const [currentUser, setCurrentUser] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [nearByData, setNearByData] = useState([]);

  const [filterValues, setFilterValues] = useState({
    kitchens: "",
    atmospheres: "",
    facilities: "",
    areas: "",
    menuTypes: "",
  });

  const handleFilterChange = (selectedOptions) => {
    setFilterValues(selectedOptions);
  };
  const user_id = currentUser?.id || userData?.user?.id;

  const { data, loading, error, refetch } = useFetch("hotels", user_id);
  console.log(user_id, "data");

  useEffect(() => {
    // Refetch data when the user logs out (user_id changes) or when the location changes to "/"
    if (location.pathname === "/" || !user_id) {
      refetch();
    }
    const fetchUserData = async () => {
      try {
        const response = await verifyUser();
        const data = await response.data;

        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
    // Get user location
    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     setUserLocation({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //     });
    //   },
    //   (error) => {
    //     console.error("Error fetching location:", error);
    //     // Handle location error (optional)
    //   }
    // );
  }, [location.pathname, user_id, refetch]);

  const getLocation = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const permissionStatus = await Geolocation.requestPermissions();
        if (permissionStatus.location === "granted") {
          const coordinates = await Geolocation.getCurrentPosition();
          console.log("User location:", coordinates);
          setUserLocation({
            latitude: coordinates.coords.latitude,
            longitude: coordinates.coords.longitude,
          });
        } else {
          alert("Please enable location services in your app settings.");
        }
      } catch (error) {
        console.error(
          "Error requesting geolocation permissions or getting position:",
          error
        );
      }
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      getLocation();
    };
    fetchLocation();
  }, []);

  const pathname = location.pathname;
  let page = ""; // Default page value

  if (pathname === "/") {
    page = "home"; // Set 'home' when the path is '/'
  } else {
    console.log(pathname, "name path"); // Log for other paths
  }

  const payload = {
    id: user_id,
    latitude: userLocation?.longitude,
    longitude: userLocation?.latitude,
    page, // Add 'home' or the page name in the payload
  };

  console.log(userLocation, "userLocation");

  const getNearbyRestaurant = async () => {
    try {
      const response = await fetchUserNearByRestaurants({ payload });
      const data = await response;
      const nearbyData = data ? transformData(data) : [];
      const approveNearbyData = nearbyData.filter(
        (item) => item.is_approved && item.status === "active"
      );
      setNearByData(approveNearbyData);
      console.log(approveNearbyData, "response of nearby home");
      return response;
    } catch (error) {
      console.log(error, "error");
    }
  };

  // Trigger fetching nearby restaurants when userLocation is available
  useEffect(() => {
    if (userLocation) {
      getNearbyRestaurant();
    }
  }, [userLocation]);

  // const transformedData = data ? transformData(data) : [];
  // Transform and filter the data
  const transformedData = data ? transformData(data) : [];
  console.log(transformedData, "transformedData");

  const approvedData = transformedData.filter(
    (item) => item.is_approved && item.status === "active"
  );

  const hasMore = visibleCards < approvedData.length;
  const hasAllMore = visibleAllCards < approvedData.length;
  const hasFeatureMore =
    visibleFeatureCards <
    approvedData.filter((item) => item.is_featured).length;

  const handleAllLoadMore = () => {
    setVisibleAllCards((prevVisibleCards) => prevVisibleCards + 4);
  };
  const handleFeatureLoadMore = () => {
    setVisibleFeatureCards((prevVisibleCards) => prevVisibleCards + 4);
  };

  const handleLoadMore = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards + 4);
  };

  // Callback function to trigger refetch
  const handleWishlistChange = () => {
    refetch();
  };

  // Choose data to display based on location permission
  const dataToDisplay = nearByData.length > 0 ? nearByData : approvedData;

  // const nearBy = transformedData
  // .filter((item) => item.is_approved && item.status === "active")
  // .filter((item) => {
  //   if (!userLocation) return true; // If location is not available, show all
  //   const { latitude: itemLat, longitude: itemLon } = item;

  //   // Validate coordinates
  //   if (isNaN(itemLat) || isNaN(itemLon)) {
  //     console.error('Invalid restaurant coordinates:', { itemLat, itemLon });
  //     return false; // Skip items with invalid coordinates
  //   }

  //   const distance = getDistance(
  //     userLocation.latitude,
  //     userLocation.longitude,
  //     itemLat,
  //     itemLon
  //   );
  //   return distance <= 10000; // Filter restaurants within 10 km radius
  // });
  const [showModal, setShowModal] = useState(false);
  const [destination, setDestination] = useState(""); // For signup or login
  const navigate = useNavigate();

  const handleOpenModal = (path) => {
    setDestination(path); // Set the destination path (signup/login)
    setShowModal(true); // Show the modal
  };

  const handleSelectRole = (role) => {
    // Navigate to the selected path with the role type as state
    navigate(destination, { state: { type: role } });
  };

  return (
    <>
      <div className="bg-hero sm:h-[650px] h-[450px] sm:my-16 my-12 bg-no-repeat bg-cover container rounded-xl overflow-hidden px-0">
        <div className="container h-full flex items-center sm:items-end px-0 ">
          <div className="lg:w-7/12 w-full flex pl-10 py-12 flex-col justify-between h-full">
            <div className="w-[100%] sm:w-[85%]">
              <h2 className="text-white text-6xl inline sm:block">
                Get your next
                <span className="font-bold text-tn_primary inline sm:block">
                  {" "}
                  weeknight job shifts
                </span>
              </h2>
              <p className=" my-4 text-base w-full text-white  font-normal sm:text-start text-center sm:w-[95%]">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
              </p>
              <div className="flex container px-0 space-x-3 mt-10">
                <Button
                  onClick={() => handleOpenModal("/signup")}
                  // className="border p-3 bg-gray-200 rounded-lg"
                >
                  Signup
                </Button>
                <Button
                  onClick={() => handleOpenModal("/login")}
                  className="border border-white"
                  bgColor="transparent"
                >
                  Login
                </Button>
              </div>
            </div>
            <div>
              <p className="text-white font-base">Trusted By:</p>
              <ul className="flex flex-wrap space-x-3 custom-icons mt-4">
                <li>
                  <img src={paypal} alt="" />
                </li>
                <li>
                  <img src={google} alt="" />
                </li>
                <li>
                  <img src={payoneer} alt="" />
                </li>
                <li>
                  <img src={meta} alt="" />
                </li>
                <img src={netflix} alt="" />
                <li></li>
                <img src={png} alt="" />
                <li></li>
              </ul>
            </div>
          </div>
          <div className="lg:w-5/12 w-full ">
            <div className="flex space-x-2 -mr-6">
              <BannerSlider />
              <BannerSlider reverse={true} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="flex justify-between mb-10 sm:mb-14 flex-col sm:flex-row items-end">
          <div className="text-center sm:text-start">
            <h2 className="text-3xl w-full text-black sm:text-4xl md:text-5xl font-extrabold ">
              Restaurants Near You
            </h2>
            <p className="text-lg font-normal text-black py-2 sm:py-0">
              Popular types of food & restaurants near you
            </p>
          </div>
          <Link
            state={{ heading: "nearby" }}
            to={{
              pathname: "/listing",
            }}
            className="border text-center p-3 rounded-lg border-black h-min mt-1 bg-transparent hover:bg-tn_pink hover:text-white hover:border-tn_pink duration-200 sm:inline-block block sm:w-auto w-[90%] m-auto sm:m-0"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <p className="p-4 text-center container mx-auto">
            <Loader />
          </p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
              {dataToDisplay.slice(0, visibleCards).map((data) => (
                <CardCarousel
                  key={data.id}
                  id={data.id}
                  title={data.title}
                  address={data.location}
                  images={data.images}
                  rating={data.rating}
                  type={data.type}
                  timeline={data.timeline}
                  is_favorite={data.is_favorite}
                  // latitude={data.latitude}
                  // longitude={data.longitude}
                  onWishlistChange={handleWishlistChange} // Pass the refetch trigger
                />
              ))}
            </div>
            <LoadMore
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              className={"mt-5"}
            />
          </>
        )}

        {/* Featured Carousel */}
        <div className="mt-20">
          <div className="flex justify-between mb-10 sm:mb-14 flex-col sm:flex-row items-end">
            <div className="text-center sm:text-start">
              <h2 className="text-3xl w-full text-black sm:text-4xl md:text-5xl font-extrabold ">
                Featured Restaurants
              </h2>
              <p className="text-lg font-normal text-black py-2 sm:py-0">
                Checkout some of our Best Featured Restaurants of all the time
              </p>
            </div>
            <Link
              state={{ heading: "featured" }}
              to={{
                pathname: "/listing",
              }}
              className="border text-center p-3 rounded-lg border-black h-min mt-1 bg-transparent hover:bg-tn_pink hover:text-white hover:border-tn_pink duration-200 sm:inline-block block sm:w-auto w-[90%] m-auto sm:m-0"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <p className="p-4 text-center container mx-auto">
              <Loader />
            </p>
          ) : error ? (
            <p>Error: {error.message}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
                {approvedData
                  .filter((data) => data.is_featured == true)
                  .slice(0, visibleFeatureCards)
                  .map((data, index) => (
                    <CardCarousel
                      key={index}
                      id={data.id}
                      title={data.title}
                      address={data.location}
                      images={data.images}
                      type={data.type}
                      is_featured={data.is_featured}
                      is_favorite={data.is_favorite}
                      onWishlistChange={handleWishlistChange} // Pass the refetch triggers
                    />
                  ))}
              </div>
              {hasFeatureMore && (
                <LoadMore
                  onLoadMore={handleFeatureLoadMore}
                  hasMore={hasFeatureMore}
                  className={"mt-5"}
                />
              )}
            </>
          )}
        </div>
      </div>

      <div className="container mx-auto">
        <div className="bg-appbanner sm:h-[439px] h-[220px] my-16 bg-no-repeat bg-cover px-2 lg:px-8 flex flex-wrap items-center justify-center sm:justify-between bg-right">
          <div className="w-2/5 h-full pt-4 hidden lg:block">
            <img
              src={App}
              alt=""
              className="h-full object-cover w-[90%] lg:w-full"
            />
          </div>
          <div className="lg:w-3/5 w-4/5">
            <p className="text-white text-2xl hidden sm:block">
              Popular food & restaurants near you
            </p>
            <h2 className=" mb-2 text-3xl w-full text-white sm:text-4xl md:text-5xl font-extrabold sm:mb-4 lg:w-[80%]  sm:text-start text-center">
              Download our all new Mobile App
            </h2>
            <img src={storeBtn} alt="" className="mx-auto sm:mx-0" />
          </div>
        </div>
      </div>

      <div className="container mx-auto pb-10">
        <div className="flex justify-between mb-10 sm:mb-14 flex-col sm:flex-row items-end">
          <div className="text-center sm:text-start ">
            <h2 className="text-3xl w-full text-black sm:text-4xl md:text-5xl font-extrabold ">
              Browse all our Best Restaurants
            </h2>
            <p className="text-lg font-normal text-black py-2 sm:py-0">
              Explore all listed Restaurants we have | Popular types of food &
              restaurants near you
            </p>
          </div>
          <Link
            state={{ heading: "all restaurant" }}
            to={{
              pathname: "/listing",
            }}
            className="border text-center p-3 rounded-lg border-black h-min mt-1 bg-transparent hover:bg-tn_pink hover:text-white hover:border-tn_pink duration-200 sm:inline-block block sm:w-auto w-[90%] m-auto sm:m-0"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <p className="p-4 text-center container mx-auto">
            <Loader />
          </p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
              {approvedData.slice(0, visibleAllCards).map((data) => (
                <CardCarousel
                  key={data.id}
                  id={data.id}
                  title={data.title}
                  address={data.location}
                  images={data.images}
                  rating={data.rating}
                  type={data.type}
                  timeline={data.timeline}
                  is_favorite={data.is_favorite}
                  onWishlistChange={handleWishlistChange} // Pass the refetch trigger
                />
              ))}
            </div>
            <LoadMore
              onLoadMore={handleAllLoadMore}
              hasMore={hasAllMore}
              className={"mt-5"}
            />
          </>
        )}
      </div>

      {/* Render Modal */}
      {showModal && (
        <AuthModal
          title="Are you signing up/logging in as an Employee or Employer?"
          onSelectRole={handleSelectRole}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
