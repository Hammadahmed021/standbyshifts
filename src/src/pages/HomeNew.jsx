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
  EmpCard,
  EmpCardSlider,
  ContactForm,
  TestimonialSlider,
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
  hero,
  girl,
  connect,
  people,
  peoples,
} from "../assets";
import {
  employees,
  employer,
  imageData,
  infoGrid,
  localDB,
  revenueGrid,
  testimonial,
} from "../utils/localDB";
import useFetch from "../hooks/useFetch";
import { transformData, getDistance } from "../utils/HelperFun";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchUserNearByRestaurants, verifyUser } from "../utils/Api";
import { app } from "../service/firebase";
import { Capacitor } from "@capacitor/core";
import BannerSlider from "../component/BannerSlider";
import InfoGrid from "../component/InfoGrid";
import RevenueCard from "../component/RevenueCard";
import { FaClipboard, FaClipboardCheck, FaCoffee, FaUser, FaUsers } from "react-icons/fa";
import AnimatedCounter from "../component/AnimatedCounter";

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
      <div className="bg-hero sm:h-[650px] h-[450px] sm:mb-16 mb-12 mt-2 bg-no-repeat bg-cover container rounded-site overflow-hidden px-0">
        <div className="container h-full flex items-center sm:items-end px-0 ">
          <div className="lg:w-7/12 w-full flex pl-10 py-0 flex-col justify-evenly h-full">
            <div className="w-[100%] sm:w-[85%]">
              <h2 className="text-white text-6xl inline sm:block leading-tight">
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
                  Register
                </Button>
                <Button
                  onClick={() => handleOpenModal("/login")}
                  className="border border-white"
                  bgColor="transparent"
                >
                  Log In
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
                <li>
                  <img src={netflix} alt="" />
                </li>
                <li>
                  <img src={png} alt="" />
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:w-5/12 w-full ">
            <div className="flex space-x-2 -mr-6">
              <BannerSlider images={imageData} />
              <BannerSlider images={imageData} reverse={true} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto ">
        <div className=" mb-10 sm:mb-14">
          <div className="text-center sm:text-center md:w-[44%] mx-auto">
            <h2 className="text-[26px] w-full text-black md:text-[50px] leading-none font-semibold">
              A whole world of talented peoples
            </h2>
            <p className="text-base w-full text-tn_text_grey  font-normal text-center py-2 sm:py-0 mt-4">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout.
            </p>
          </div>
          <div className="mt-8">
            <InfoGrid items={infoGrid} />
          </div>
        </div>
      </div>

      <div className="bg-hero sm:h-[700px] h-[450px] sm:mb-16 mb-12 mt-2 bg-no-repeat bg-cover container rounded-site overflow-hidden px-0">
        <div className="container h-full flex items-center sm:items-end px-0 ">
          <div className="lg:w-7/12 w-full flex pl-10 py-0 flex-col justify-evenly h-full">
            <div className="w-[100%] sm:w-[95%]">
              <h3 className="text-white text-5xl inline sm:block leading-tight font-semibold">
                Find the talent needed to get your business growing.
              </h3>
              <p className=" my-4 text-base w-full text-tn_text_grey  font-normal sm:text-start text-center">
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour.
              </p>
              <div className="my-4">
                <RevenueCard items={revenueGrid} />
              </div>
              <div className="flex container px-0 space-x-3 mt-10">
                <Button
                  onClick={() => handleOpenModal("/signup")}
                // className="border p-3 bg-gray-200 rounded-lg"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
          <div className="lg:w-5/12 w-full ">
            <div className="flex flex-col items-ends justify-center">
              <img
                src={hero}
                alt=""
                className="w-full h-[600px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="flex items-center space-x-4 relative">
          <div className="md:w-8/12 w-12 employees">
            <EmpCardSlider data={employees} />
          </div>
          <div className="md:w-4/12 w-12 pb-8">
            <h3 className="text-tn_dark text-5xl inline sm:block leading-tight font-semibold">
              Top rated employees
            </h3>
            <p className=" my-4 text-base w-full text-tn_text_grey  font-normal sm:text-start text-center">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-hero sm:h-auto h-auto sm:mb-24 mb-12 mt-16 bg-no-repeat bg-cover container rounded-site overflow-hidden px-0 py-6">
        <div className="container h-full flex items-center px-0 ">
          <div className="lg:w-5/12 w-full flex pl-10 py-0 flex-col justify-evenly h-full">
            <div className="w-[100%] sm:w-[95%]">
              <h3 className="text-white text-5xl inline sm:block leading-tight font-semibold">
                Most popular employers
              </h3>
              <p className=" my-4 text-base w-full text-white  font-normal sm:text-start text-center">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
              </p>
              <div className="my-6">
                <h4 className="text-white text-base mb-2 font-semibold">Popular searches:</h4>
                <ul className="flex items-center space-x-2">
                  <li>
                    <span className="border border-tn_text_grey rounded-2xl flex space-x-2">
                      <span className="text-tn_text_grey text-xs py-1 px-2">
                        Accountability
                      </span>
                    </span>
                  </li>
                  <li>
                    <span className="border border-tn_text_grey rounded-2xl flex space-x-2">
                      <span className="text-tn_text_grey text-xs py-1 px-2">
                        Factory worker
                      </span>
                    </span>
                  </li>
                  <li>
                    <span className="border border-tn_text_grey rounded-2xl flex space-x-2">
                      <span className="text-tn_text_grey text-xs py-1 px-2">
                        House keeping
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="lg:w-7/12 w-full ">
            <div className="flex flex-col items-ends justify-center px-6 employer">
              <EmpCardSlider data={employer} />
            </div>
          </div>
        </div>
      </div>

      <div className="container bg-tn_pink rounded-site p-12 ">
        <div className="flex item-center justify-between">
          <AnimatedCounter
            icon={FaClipboard}
            heading="Jobs posted"
            targetNumber={200} // Target number to count to
            duration={3000} // Duration in milliseconds
          />
          <AnimatedCounter
            icon={FaClipboardCheck}
            heading="Companies"
            targetNumber={25} // Target number to count to
            duration={3000} // Duration in milliseconds
          />
          <AnimatedCounter
            icon={FaUsers}
            heading="Members"
            targetNumber={153} // Target number to count to
            duration={3000} // Duration in milliseconds
          />
          <AnimatedCounter
            icon={FaCoffee}
            heading="Shifts done"
            targetNumber={88} // Target number to count to
            duration={3000} // Duration in milliseconds
          />
        </div>
      </div>

      <div className="container flex items-center my-20">
        <div className="lg:w-5/12 w-full">
          <img src={girl} alt="" /></div>
        <div className="lg:w-7/12 w-full">
          <div className="text-center w-[65%] mx-auto">
            <h3 className="text-tn_dark text-5xl inline sm:block leading-tight font-semibold">
              Connect us
              to register yourself
            </h3>
            <p className=" my-4 text-base w-full text-tn_text_grey  font-normal  text-center">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>
          </div>
          <div className="mx-auto w-[80%]">
            <ContactForm />
          </div>
        </div>
      </div>

      <div className="container rounded-site bg-tn_light_grey flex items-center px-0">
        <div className="lg:w-6/12 w-full">
          <div className="p-12 text-start">
            <h3 className="text-tn_dark text-5xl inline sm:block leading-tight font-semibold">
              Get started today for better reach
            </h3>
            <p className=" my-4 text-base w-full text-tn_text_grey  font-normal">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. </p>
            <div className="flex space-x-2 mt-10">
              <Button
                type=""
              >
                Employee
              </Button>
              <Button
                type=""
                bgColor={`bg-tn_pink`}
              >
                Business
              </Button>
            </div>
          </div>
        </div>
        <div className="lg:w-6/12 w-full">
          <img src={connect} alt="" /></div>
      </div>

      <div className="container flex items-center my-20 testimonials">
        <div className="lg:w-5/12 w-full">
          <img src={peoples} alt="" /></div>
        <div className="lg:w-7/12 w-full ">
          <div className="text-start w-full lg:w-[65%] mx-auto">
            <h3 className="text-tn_dark text-5xl inline sm:block leading-tight font-semibold">
              Trusted by people all over
            </h3>
            <TestimonialSlider data={testimonial}/>
          </div>


        </div>
      </div>

      {/* Render Modal */}
      {showModal && (
        <AuthModal
          title="Define yourself..."
          onSelectRole={handleSelectRole}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}