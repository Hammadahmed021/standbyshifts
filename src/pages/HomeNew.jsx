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
  LoginSignupModal,
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
import { fetchTopRatedUsers, fetchUserNearByRestaurants, verifyUser } from "../utils/Api";
import { app } from "../service/firebase";
import { Capacitor } from "@capacitor/core";
import BannerSlider from "../component/BannerSlider";
import InfoGrid from "../component/InfoGrid";
import RevenueCard from "../component/RevenueCard";
import {
  FaClipboard,
  FaClipboardCheck,
  FaCoffee,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import AnimatedCounter from "../component/AnimatedCounter";

export default function HomeNew() {
  const isDesktop = useMediaQuery("(max-width: 991px)");
  const userData = useSelector((state) => state.auth.userData);


  const [visibleCards, setVisibleCards] = useState(4);
  const [visibleAllCards, setVisibleAllCards] = useState(4);
  const [visibleFeatureCards, setVisibleFeatureCards] = useState(4);
  const [currentUser, setCurrentUser] = useState({});
  const [topRatedUsers, setTopRatedUsers] = useState([]);
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
  ////console.log(user_id, "data");

  const getUserIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Failed to fetch IP address:", error);
      return null;
    }
  };
  useEffect(() => {
    const getTopRatedUsers = async () => {
      try {
        const response = await fetchTopRatedUsers();
        ////console.log(response, 'response of top rated user');

        setTopRatedUsers(response);
      } catch (error) {
        ////console.log(error, "unable to fetch top rated users");

      }
    }
    getTopRatedUsers()

  }, [])

  useEffect(() => {
    ////console.log(topRatedUsers, "Updated topRatedUsers");
  }, [topRatedUsers]); // This will log the updated state when it changes


  useEffect(() => {
    // Refetch data when the user logs out (user_id changes) or when the location changes to "/"
    if (location.pathname === "/" || !user_id) {
      refetch();
    }
    const fetchUserData = async () => {
      const userAgent = navigator.userAgent;
      const ipAddress = await getUserIP();
      const token = localStorage.getItem("webToken");

      const payload = {
        userAgent,
        ipAddress,
        token,
      };
      try {
        const response = await verifyUser(payload);
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



  const pathname = location.pathname;
  let page = ""; // Default page value

  if (pathname === "/") {
    page = "home"; // Set 'home' when the path is '/'
  } else {
    ////console.log(pathname, "name path"); // Log for other paths
  }



  // const transformedData = data ? transformData(data) : [];
  // Transform and filter the data
  const transformedData = data ? transformData(data) : [];
  ////console.log(transformedData, "transformedData");

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

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const handleRoleClick = (role) => {
    setSelectedRole(role); // Store the selected role (employee or employer)
    setModalOpen(true); // Open the modal
  };

  const handleModalAction = (action) => {
    setModalOpen(false); // Close the modal
    if (action === "login") {
      navigate("/login", { state: { type: selectedRole } });
    } else if (action === "signup") {
      navigate("/signup", { state: { type: selectedRole } });
    }
  };



  return (
    <>
      <div className="bg-hero sm:h-[650px] h-[500px] sm:mb-16 mb-12 mt-2 bg-no-repeat bg-cover container rounded-site overflow-hidden px-0">
        <div className="container h-full flex items-center sm:items-end px-4 sm:px-0">
          <div className="lg:w-7/12 w-full flex pl-0 sm:pl-10 py-0 flex-col justify-evenly h-full">
            <div className="w-[100%] sm:w-[95%]">
              <h1 className="text-white text-4xl sm:text-6xl inline sm:block leading-normal">
                {/* Get your next */}
                Changing the Workforce,
                <span className="font-bold text-tn_primary inline">
                  {" "}
                  {/* weeknight shifts */}
                  One Shift at a Time.
                </span>
              </h1>
              <p className=" my-4 text-base w-full text-white  font-normal sm:text-start sm:w-[95%]">
                Looking to Pick Up Shifts? Register to Find Available Shifts. <br />
                Looking for Reliable Staff? Register to Fill the gaps in Your Staffing Schedule.
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
            {/* <div>
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
            </div> */}
          </div>
          <div className="lg:w-5/12 w-full hidden sm:block">
            <div className="flex space-x-2 -mr-6">
              <BannerSlider images={imageData} />
              <BannerSlider images={imageData} reverse={true} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className=" mb-10 sm:mb-14">
          <div className="text-center sm:text-center md:w-[44%] mx-auto">
            <h2 className="text-[26px] w-full text-black md:text-[50px] leading-none font-semibold">
              {/* A whole world of talented peoples */}
              Connect to Earn Extra Income.
            </h2>
            <p className="text-base w-full text-tn_text_grey  font-normal text-center py-2 sm:py-0 mt-4">
              Prepare for Unexpected Staffing Needs.
            </p>
          </div>
          <div className="mt-8">
            <InfoGrid items={infoGrid} />
          </div>
        </div>
      </div>

      <div className="bg-hero sm:h-[700px] h-[auto] py-8 sm:py-0 sm:mb-16 mb-12 mt-2 bg-no-repeat bg-cover container rounded-site overflow-hidden px-0">
        <div className="container h-full flex items-center sm:items-end px-4 sm:px-0">
          <div className="lg:w-7/12 w-full flex pl-0 sm:pl-10 py-0 flex-col justify-evenly h-full">
            <div className="w-[100%] sm:w-[95%]">
              <h3 className="text-white text-4xl sm:text-5xl inline sm:block leading-normal font-semibold">
                {/* Find the talent needed to get your business growing. */}
                Changing the Global Workforce One Shift at a Time.
              </h3>
              {/* <p className=" my-4 text-base w-full text-tn_text_grey  font-normal sm:text-start">
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour.
              </p> */}
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
          <div className="lg:w-5/12 w-full hidden sm:block">
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
        <div className="flex flex-col-reverse sm:flex-row items-center space-x-4 relative">
          <div className="md:w-8/12 w-full employees pointer-events-auto">
            <EmpCardSlider data={topRatedUsers?.top_rated_employees} />
          </div>
          <div className="md:w-4/12 w-full pb-8">
            <h3 className="text-tn_dark text-4xl sm:text-5xl inline sm:block leading-tight font-semibold">
              {/* Top rated employees */}
              Dependable Shift Seekers.
            </h3>
            {/* <p className=" my-4 text-base w-full text-tn_text_grey  font-normal sm:text-start ">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when.
            </p> */}
          </div>
        </div>
      </div>

      <div className="bg-hero sm:h-auto h-auto sm:mb-24 mb-12 mt-16 bg-no-repeat bg-cover container rounded-site overflow-hidden px-0 py-6">
        <div className="container h-full flex items-center flex-col sm:flex-row px-4 sm:px-0 ">
          <div className="lg:w-5/12 w-full flex pl-0 sm:pl-10 py-0 flex-col justify-evenly h-full">
            <div className="w-[100%] sm:w-[95%]">
              <h3 className="text-white text-4xl sm:text-5xl inline sm:block leading-tight font-semibold">
                {/* Most popular employers */}
                Businesses Hiring Shift Seekers.
              </h3>
              {/* <p className=" my-4 text-base w-full text-white  font-normal sm:text-start  ">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
              </p> */}
              {/* <div className="my-6">
                <h4 className="text-white text-base mb-2 font-semibold">
                  Popular searches:
                </h4>
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
              </div> */}
            </div>
          </div>
          <div className="lg:w-7/12 w-full ">
            <div className="flex flex-col items-ends justify-center px-6 employer pointer-events-auto">
              <EmpCardSlider data={topRatedUsers?.top_rated_employers} />
            </div>
          </div>
        </div>
      </div>

      <div className="container bg-tn_pink rounded-site p-4 sm:p-12 mb-12 sm:mb-20">
        <div className="flex flex-wrap item-center justify-between">
          <AnimatedCounter
            icon={FaClipboard}
            heading="Shifts posted"
            targetNumber={200} // Target number to count to
            duration={3000} // Duration in milliseconds
            className={"p-3"}
          />
          <AnimatedCounter
            icon={FaClipboardCheck}
            heading="Companies"
            targetNumber={25} // Target number to count to
            duration={3000} // Duration in milliseconds
            className={"p-3"}
          />
          <AnimatedCounter
            icon={FaUsers}
            heading="Members"
            targetNumber={153} // Target number to count to
            duration={3000} // Duration in milliseconds
            className={"p-3"}
          />
          <AnimatedCounter
            icon={FaCoffee}
            heading="Shifts done"
            targetNumber={88} // Target number to count to
            duration={3000} // Duration in milliseconds
            className={"p-3"}
          />
        </div>
      </div>

      {/* <div className="container flex flex-col-reverse sm:flex-row items-center my-20">
        <div className="lg:w-5/12 w-full mt-12 sm:mt-0">
          <img src={girl} alt="" />
        </div>
        <div className="lg:w-7/12 w-full ">
          <div className="text-center w-full sm:w-[65%] mx-auto">
            <h3 className="text-tn_dark text-4xl sm:text-5xl inline sm:block leading-tight font-semibold">
              Register to Connect with Businesses Hiring Shift Seekers.
            </h3>
            
          </div>
          <div className="mx-auto w-[80%] ">
            <ContactForm />
          </div>
        </div>
      </div> */}

      <div className="container rounded-site bg-tn_light_grey flex items-center px-0">
        <div className="lg:w-6/12 w-full">
          <div className="p-6 sm:p-12 text-start">
            <h3 className="text-tn_dark text-4xl sm:text-5xl inline sm:block leading-tight font-semibold">
              {/* Get started today for better reach */}
              Get Started to Reach Shift Seekers Eager to Meet your Staffing Needs.
            </h3>
            {/* <p className=" my-4 text-base w-full text-tn_text_grey  font-normal">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout.{" "}
            </p> */}
            <div className="flex space-x-2 mt-10">
              <Button onClick={() => handleRoleClick("employee")}>
                Shift Seeker
              </Button>
              <Button
                onClick={() => handleRoleClick("employer")}
                bgColor="bg-tn_pink"
              >
                {" "}
                Business
              </Button>
            </div>
          </div>
        </div>
        <div className="lg:w-6/12 w-full hidden sm:block">
          <img src={connect} alt="" />
        </div>
      </div>

      <div className="container flex items-center my-20 testimonials">
        <div className="lg:w-5/12 w-full">
          <img src={peoples} alt="" />
        </div>
        <div className="lg:w-7/12 w-full ">
          <div className="text-start w-full lg:w-[65%] mx-auto">
            <h3 className="text-tn_dark text-4xl sm:text-5xl inline sm:block leading-tight font-semibold">
              Control Your Workforce Experience.
            </h3>
            <TestimonialSlider data={testimonial} />
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

      {/* Login signup Modal */}
      {isModalOpen && (
        <LoginSignupModal
          role={selectedRole}
          onAction={(action) => handleModalAction(action)}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
