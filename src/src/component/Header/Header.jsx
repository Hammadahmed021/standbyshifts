import React, { useState, useEffect, useRef } from "react";
import { Logo, fallback, fb, instagram, twitter, youtube } from "../../assets";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
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
import useMediaQuery from "../../hooks/useQuery";
import useFetch from "../../hooks/useFetch";
import Search from "../Search";
import LogoutBtn from "./LogoutBtn";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../LanguageSelector";
import { verifyUser } from "../../utils/Api";
import { Capacitor } from "@capacitor/core";

const Header = ({ style }) => {
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const isDesktop = useMediaQuery("(max-width: 991px)");
  const [toggle, setToggle] = useState(false);
  const { data } = useFetch("hotels"); // Example useFetch hook, adjust as needed
  const { t } = useTranslation();
  const location = useLocation(); // Hook to get the current route
  const isApp = Capacitor.isNativePlatform();

  console.log(userData?.user?.type, 'userData');

  const defaultMenu = (
    <>
      <li>
        <Link to={"/"}>Home</Link>
      </li>
      <li>
        <Link to={"/"}>Post Job</Link>
      </li>
      <li>
        <Link to={"/"}>Find Job</Link>
      </li>
      <li>
        <Link to={"/"}>Contact</Link>
      </li>
      <li>
        <Link to={"/about"}>About</Link>
      </li>
    </>
  );

  const employeeMenu = (
    <>
      <li>
        <Link to={"/employee"}>Employee Home</Link>
      </li>
      <li>
        <Link to={"/find-jobs"}>Find Jobs</Link>
      </li>
      <li>
        <Link to={"/saved-jobs"}>Saved Jobs</Link>
      </li>
      <li>
        <Link to={"/employee-profile"}>Profile</Link>
      </li>
      <li>
        <Link to={"/contact"}>Contact</Link>
      </li>
    </>
  );

  const employerMenu = (
    <>
      <li>
        <Link to={"/employer"}>Employer Home</Link>
      </li>
      <li>
        <Link to={"/post-job"}>Post Job</Link>
      </li>
      <li>
        <Link to={"/manage-jobs"}>Manage Jobs</Link>
      </li>
      <li>
        <Link to={"/candidates"}>Find Candidates</Link>
      </li>
      <li>
        <Link to={"/employer-profile"}>Company Profile</Link>
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

  const fetchCurrentUserData = async () => {
    const userAgent = navigator.userAgent;
    const ipAddress = await getUserIP();

    const payload = {
      userAgent,
      ipAddress,
    };
    try {
      const response = await verifyUser(payload);
      const data = await response.data;
      setCurrentUser(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Close menu on route change
  useEffect(() => {
    if (toggle) {
      setToggle(false); // Close menu when navigating
    }
  }, [location]); // Trigger when the route changes

  useEffect(() => {
    fetchCurrentUserData();

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
      <div className="container sm:px-0 mx-auto">
        {!isDesktop ? (
          <nav className="flex py-4 items-center">
            <div className="flex items-center relative">
              <Link to={
                userData
                  ? userData.user.type === "employee"
                    ? "employee"
                    : "employer"
                  : "/"
              }>
                <img src={Logo} alt="" className="w-28" />
              </Link>
              {/* <Search data={data} /> */}
            </div>
            <ul className="flex ml-auto items-center space-x-6 border-li font-lato font-medium text-base text-tn_text_grey">

              {userData ? (
                userData.user.type == "employee" ? (
                  employeeMenu
                ) : userData.user.type == "employer" ? (
                  employerMenu
                ) : (
                  defaultMenu
                )
              ) : (
                defaultMenu
              )}



              {/* <span className="mx-4">|</span> */}
              {authStatus && (
                <li className="inline-flex space-x-2">
                  <div className="relative inline-block">
                    <div className="flex items-center cursor-pointer">
                      <img
                        src={
                          currentUser?.employee?.profile_picture ||
                          currentUser?.employer?.logo ||
                          userData?.profile_image?.name ||
                          fallback
                        }
                        alt="user profile"
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-tn_dark text-base font-medium ml-2">
                        {currentUser?.name ||
                          userData?.user?.name ||
                          userData?.displayName}
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
                        className="absolute left-0 right-0 top-12 mt-1 bg-white border border-gray-300 shadow-md rounded-lg z-10"
                      >
                        <Link

                          to={
                            userData && userData.user.type === "employee"
                              ? "employee-profile"
                              : "employer-profile"
                          }

                          className="block px-4 py-2 text-tn_dark hover:bg-gray-200"
                        >

                          Profile
                        </Link>
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
                            src={
                              currentUser?.profile_image ||
                              userData?.profile_image?.name ||
                              fallback
                            }
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
                          <Link to={"/login"}>Login</Link>
                        </li>
                      </>
                    )}
                  </div>

                  <ul className="space-y-6 text-xl font-bold mt-6">
                    <li>
                      <Link to={"/profile"}>Edit Profile</Link>
                    </li>
                    <li>
                      <Link to={"/profile"}>Booking History</Link>
                    </li>
                    <li>
                      <Link to={"/privacy-policy"}>Privacy Policy</Link>
                    </li>
                    <li>
                      <Link to={"/terms-of-service"}>Terms & Condition</Link>
                    </li>
                    <li>
                      <Link to={"/"}>Secure Payment</Link>
                    </li>
                    {authStatus && (
                      <li>
                        <LogoutBtn className="inline" />
                      </li>
                    )}
                  </ul>

                  <h4 className="text-xl font-bold text-tn_pink mt-10 mb-4">
                    Contact
                  </h4>
                  <ul className="text-base text-tn_dark font-medium">
                    <li>+12 345 678 000</li>
                    <li>info@tablenow.com</li>

                    <li className="mt-4">
                      7262 Sepulveda Blvd. <br />
                      Culver City, CA, 90230
                    </li>
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
              <Link to={"/profile"} className="text-tn_dark">
                <LuShoppingBag size={26} />
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;