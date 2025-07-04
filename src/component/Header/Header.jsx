import React, { useState, useEffect, useRef } from "react";
import { Logo, avatar, fallback, fb, instagram, twitter, youtube } from "../../assets";
import { Link, NavLink, useLocation } from "react-router-dom"; // Import useLocation
import { useSelector } from "react-redux";
import {
  LuBackpack,
  LuCross,
  LuGlobe,
  LuMenu,
  LuShoppingBag,
  LuShoppingCart,
  LuUtensilsCrossed,
  LuX,
} from "react-icons/lu";

import {
  Button,
  AuthModal,
} from "../../component";

import useMediaQuery from "../../hooks/useQuery";
import useFetch from "../../hooks/useFetch";
import Search from "../Search";
import LogoutBtn from "./LogoutBtn";
import { FaBell, FaChevronDown, FaChevronUp, FaSms } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../LanguageSelector";
import { verifyUser } from "../../utils/Api";
import { Capacitor } from "@capacitor/core";
import { FaMessage } from "react-icons/fa6";

import { useNavigate } from "react-router-dom";


const Header = ({ style }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const userImage = useSelector((state) => state.auth.userImage);
  const userName = useSelector((state) => state.auth.userName);
  const isDesktop = useMediaQuery("(max-width: 991px)");
  const [toggle, setToggle] = useState(false);
  const { data } = useFetch("hotels"); // Example useFetch hook, adjust as needed
  const { t } = useTranslation();
  const location = useLocation(); // Hook to get the current route
  const isApp = Capacitor.isNativePlatform();

   const [showModal, setShowModal] = useState(false);
    const [destination, setDestination] = useState(""); // For signup or login

  const userType = userData?.type || userData?.user?.type || localStorage.getItem("userType"); // Fetch user type

   const [profileImage, setProfileImage] = useState(() => {
    const localImage = localStorage.getItem("profile_image");
    if (localImage && localImage !== "null" && localImage !== "undefined") {
      return localImage;
    }
    console.log(currentUser?.employee?.profile_picture);
    console.log(currentUser?.employer?.logo);
    console.log(userData?.profile_image?.name);
    console.log(avatar);
    
    return (
      currentUser?.employee?.profile_picture ||
      currentUser?.employer?.logo ||
      userData?.profile_image?.name ||
      avatar
    );
  });

  useEffect(()=>{
    console.log('state auth user image : ' , userImage);
    
  },[userImage])

  const defaultMenu = (
    <>
      <li>
        <NavLink
          to={"/"}
          className={({ isActive }) => (isActive ? "text-tn_pink" : "")}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to={"/contact"}
          className={({ isActive }) => (isActive ? "text-tn_pink" : "")}
        >
          Contact
        </NavLink>
      </li>
      {/* <li>
        <NavLink
          to={"/about"}
          className={({ isActive }) => (isActive ? "text-tn_pink" : "")}
        >
          About
        </NavLink>
      </li> */}
    </>
  );

  const employeeMenu = (
    <>
      <li>
        <NavLink
          to={"/employee"}
          className={({ isActive }) => (isActive ? "text-tn_pink" : "")}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to={"/companies"}
          className={({ isActive }) => (isActive ? "text-tn_pink" : "")}
        >
          Businesses
        </NavLink>
      </li>

      <li>
        <NavLink
          to={"/jobs"}
          className={({ isActive }) => (isActive ? "text-tn_pink" : "")}
        >
          Find Shifts
        </NavLink>
      </li>

      {/* <li>
        <Link >
          <span className="rounded-full p-1 bg-tn_primary w-8 h-8 flex items-center justify-center">
            <FaBell size={18} color="#fff" />
          </span>
        </Link>
      </li>
      <li>
        <Link >
          <span className="rounded-full p-1 bg-tn_primary w-8 h-8 flex items-center justify-center">
            <FaMessage size={18} color="#fff" />
          </span>
        </Link>
      </li> */}
    </>
  );

  const employerMenu = (
    <>
      <li>
        <NavLink
          to={"/employer"}
          className={({ isActive }) => (isActive ? "text-tn_pink" : "")}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to={"/post-job"}
          className={({ isActive }) => (isActive ? "text-tn_pink" : "")}
        >
          {/* Post Shift */}
          Post New Shift
        </NavLink>
      </li>
      <li>
        <NavLink
          to={"/employees"}
          className={({ isActive }) => (isActive ? "text-tn_pink" : "")}
        >
          Shift Seekers
        </NavLink>
      </li>
      <li>
        <NavLink
          to={"/appliers-on-job"}
          className={({ isActive }) => (isActive ? "text-tn_pink" : "")}
        >
          Manage Shifts
        </NavLink>
      </li>
    </>
  );

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

 
  // const fetchCurrentUserData = async () => {
  //   localStorage.removeItem('profile_image');
  //   const userAgent = navigator.userAgent;
  //   const ipAddress = await getUserIP();
  //   const token = localStorage.getItem("webToken");

  //   const payload = {
  //     userAgent,
  //     ipAddress,
  //     token,
  //   };
  //   try {
  //     const response = await verifyUser(payload);
  //     const data = await response.data;
  //     setCurrentUser(data);
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   }
  // };

  const handleOpenModal = (path) => {
    setDestination(path); // Set the destination path (signup/login)
    setShowModal(true); // Show the modal
  };

  const handleSelectRole = (role) => {
    // Navigate to the selected path with the role type as state
    navigate(destination, { state: { type: role } });
  };




  // Close menu on route change
  useEffect(() => {
    if (toggle) {
      setToggle(false); // Close menu when navigating
    }
  }, [location]); // Trigger when the route changes

  useEffect(() => {
    // fetchCurrentUserData();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    if (toggle) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggle]);

  return (
    <header className="relative" style={style}>
      <div className="container sm:px-0 mx-auto border-b-2 mb-6 border-tn_light_grey">
        {!isDesktop ? (
          <nav className="flex py-4 items-center">
            <div className="flex items-center relative">
              <Link
                to={
                  userData
                    ? userType === "employee"
                      ? "employee"
                      : "employer"
                    : "/"
                }
              >
                <img src={Logo} alt="" className="w-28" />
              </Link>
              {/* <Search data={data} /> */}
            </div>
            <ul className="flex ml-auto items-center space-x-6 border-li font-lato font-medium text-base text-tn_text_grey">
              {userData
                ? userType == "employee"
                  ? employeeMenu
                  : userType == "employer"
                  ? employerMenu
                  : defaultMenu
                : defaultMenu}

              {/* <span className="mx-4">|</span> */}
              {authStatus && (
                <li className="inline-flex space-x-2">
                  <div className="relative inline-block">
                    <div className="flex items-center cursor-pointer">
                      {/* <img
                        src={
                          currentUser?.employee?.profile_picture ||
                          currentUser?.employer?.logo ||
                          userData?.profile_image?.name ||
                          avatar
                        }
                        alt="user profile"
                        className="w-8 h-8 rounded-full"
                      /> */}

                      
                      <img
                        src={userImage ?? avatar}
                        alt="user profile"
                        className="w-8 h-8 rounded-full"
                      />

                      
                      <span className="text-tn_dark text-base font-medium ml-2">
                        {userName}
                      </span>
                      <span
                        className="p-2"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        {isDropdownOpen ? (
                          <FaChevronUp className="text-tn_pink" size={12} />
                        ) : (
                          <FaChevronDown className="text-tn_dark" size={12} />
                        )}
                      </span>
                    </div>
                    {isDropdownOpen && (
                      <div
                        ref={dropdownRef}
                        // className="absolute left-0 right-0 top-12 mt-1 bg-white border border-gray-300 shadow-md rounded-lg z-10 overflow-hidden"
                        className="absolute right-0 top-12 mt-1 bg-white border border-gray-300 shadow-md rounded-lg z-10 overflow-hidden min-w-[10rem] w-max whitespace-nowrap"
                      >
                        <Link
                          to={
                            userData && userType === "employee"
                              ? "employee-profile"
                              : "employer-profile"
                          }
                          className="block px-4 py-2 text-tn_dark hover:bg-gray-200"
                        >
                          Profile
                        </Link>
                        {userData && userType === "employee" && (
                          <Link
                            to={"employee-experience"}
                            className="block px-4 py-2 text-tn_dark hover:bg-gray-200"
                          >
                            Work
                          </Link>
                        )}

                        <LogoutBtn />
                      </div>
                    )}
                  </div>
                </li>
              )}
            </ul>
          </nav>
        ) : (
          <nav className="flex py-4 items-center justify-between">
            <LuMenu
              onClick={() => setToggle((prev) => !prev)}
              size={24}
              className=""
            />
            {toggle && (
              <ul
                className="flex flex-col py-4 px-2 items-center bg-white shadow-lg fixed top-0 left-0 right-0  h-screen duration-200 justify-center z-10 overflow-y-auto"
                // style={{ paddingTop: isApp ? "20px" : "0" }}
              >
                <div className="relative w-full min-h-screen p-3">
                  <div className="flex justify-between items-start">
                    <LuX
                      onClick={() => setToggle((prev) => !prev)}
                      size={24}
                      className="mt-3 -ml-1"
                    />
                    {authStatus ? (
                      <li className="inline-block">
                        <span className="text-tn_dark text-lg font-medium">
                          <img
                            // src={
                            //   currentUser?.profile_image ||
                            //   userData?.profile_image?.name ||
                            //   avatar
                            // }
                            src={userImage ?? avatar}
                            alt="user profile"
                            className="w-16 h-16 rounded-full"
                          />
                        </span>
                      </li>
                    ) : (
                      <>
                        <li
                          className="inline-block px-7 rounded-md text-lg bg-tn_pink text-white py-1"
                          style={{ marginTop: isApp ? "10px" : "10px" }}
                        >
                          {/* <Link to={"/login"}>Login</Link> */}

                          <Link
                                            onClick={() => handleOpenModal("/login")}
                                          >
                                            Log In
                                          </Link>
                        </li>
                      </>
                    )}
                  </div>

                  <ul className="space-y-6 text-xl font-bold mt-6">
                    {userData
                      ? userData.user.type == "employee"
                        ? employeeMenu
                        : userData.user.type == "employer"
                        ? employerMenu
                        : defaultMenu
                      : defaultMenu}
                    {authStatus && (
                      <li>
                        <LogoutBtn className="inline" />
                      </li>
                    )}
                  </ul>

                  <h4 className="text-xl font-bold text-tn_primary mt-10 mb-4">
                    Contact
                  </h4>
                  <ul className="text-base text-tn_dark font-medium">
                    <li>424-242-4605</li>
                    <li>customercare@standbyshifts.com</li>

                    {/* <li className="mt-4">
                      7262 Sepulveda Blvd. <br />
                      Culver City, CA, 90230
                    </li> */}
                  </ul>
                  <ul className="flex flex-wrap justify-start space-x-4 mt-6 sm:mt-0 pb-4">
                    <li>
                      <a href="#1">
                        <img
                          src={instagram}
                          className="w-7 h-7 object-contain"
                        />
                      </a>
                    </li>
                    <li>
                      <a href="#1">
                        <img src={twitter} className="w-7 h-7 object-contain" />
                      </a>
                    </li>
                    <li>
                      <a href="#1">
                        <img src={fb} className="w-7 h-7 object-contain" />
                      </a>
                    </li>
                    <li>
                      <a href="#1">
                        <img src={youtube} className="w-7 h-7 object-contain" />
                      </a>
                    </li>
                  </ul>
                </div>
              </ul>
            )}

            <div className="flex items-center">
              <Link to={"/"}>
                <img src={Logo} alt="" className="w-36 sm:w-48" />
              </Link>
            </div>
            <div className="space-x-2">


              <ul className="flex ml-auto items-center space-x-6 border-li font-lato font-medium text-base text-tn_text_grey">
                  {authStatus && (
                    <li className="inline-flex space-x-2">
                      <div className="relative inline-block">
                        <div className="flex items-center cursor-pointer">
                          <img
                            // src={
                            //   currentUser?.employee?.profile_picture ||
                            //   currentUser?.employer?.logo ||
                            //   userData?.profile_image?.name ||
                            //   avatar
                            // }
                            src={userImage ?? avatar}
                            alt="user profile"
                            className="w-8 h-8 rounded-full"
                          />
                          
                          <span
                            className="p-2"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          >
                            {isDropdownOpen ? (
                              <FaChevronUp className="text-tn_pink" size={12} />
                            ) : (
                              <FaChevronDown className="text-tn_dark" size={12} />
                            )}
                          </span>
                        </div>
                        {isDropdownOpen && (
                          <div
                            ref={dropdownRef}
                            // className="absolute right-0 top-12 mt-1 bg-white border border-gray-300 shadow-md rounded-lg z-10 overflow-hidden min-w-[8rem] max-w-[16rem] w-fit"
                            className="absolute right-0 top-12 mt-1 bg-white border border-gray-300 shadow-md rounded-lg z-10 overflow-hidden min-w-[10rem] w-max max-w-[16rem]"
                          >
                            <Link
                              to={
                                userData && userType === "employee"
                                  ? "employee-profile"
                                  : "employer-profile"
                              }
                              className="block px-4 py-2 text-tn_dark hover:bg-gray-200"
                            >
                              Profile
                            </Link>
                            {userData && userType === "employee" && (
                              <Link
                                to={"employee-experience"}
                                className="block px-4 py-2 text-tn_dark hover:bg-gray-200"
                              >
                                Work
                              </Link>
                            )}
                            <div className="block px-4 py-2 text-tn_dark hover:bg-gray-200">
                              <LogoutBtn />
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  )}
              </ul>

              
              {/* <Link to={"/profile"} className="text-tn_dark">
                <LuShoppingBag size={26} />
              </Link> */}
            </div>
            
          </nav>
        )}
      </div>

        {showModal && (
        <AuthModal
          title="Define yourself..."
          onSelectRole={handleSelectRole}
          onClose={() => setShowModal(false)}
        />
      )}


    </header>
  );
};

export default Header;
