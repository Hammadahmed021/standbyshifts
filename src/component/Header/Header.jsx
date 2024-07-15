import React, { useState, useEffect, useRef } from "react";
import { Logo, fallback, fb, instagram, twitter, youtube } from "../../assets";
import { Link } from "react-router-dom";
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

const Header = () => {
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const isDesktop = useMediaQuery("(max-width: 991px)");
  const [toggle, setToggle] = useState(false);
  const { data } = useFetch("filter"); // Example useFetch hook, adjust as needed
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const { t } = useTranslation();

  useEffect(() => {
     // Function to handle click outside
     const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Attach the event listener on mount
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
    <header className="border-b-2 relative">
      <div className="container mx-auto">
        {!isDesktop ? (
          <nav className="flex py-4 items-center">
            <div className="flex items-center relative">
              <Link to={"/"}>
                <img src={Logo} alt="" className="w-64" />
              </Link>
              <Search data={data} />
            </div>
            <ul className="flex ml-auto items-center">
              <LanguageSelector />
              {/* <LuGlobe size={18} /> */}
              <span className="mx-4">|</span>
              {authStatus ? (
                <li className="inline-flex space-x-2">
                  <div className="relative inline-block">
                    <div className="flex items-center cursor-pointer">
                      <img
                        src={userData?.photoURL || fallback}
                        alt="user profile"
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-tn_dark text-base font-medium ml-2">
                        {userData?.displayName || userData?.user?.name}
                      </span>
                      <span className="p-2" onClick={toggleDropdown}>
                        {isDropdownOpen ? (
                          <FaChevronUp className="text-tn_pink" size={12} />
                        ) : (
                          <FaChevronDown className="text-tn_dark" size={12} />
                        )}
                      </span>
                    </div>
                    {isDropdownOpen && (
                      <div ref={dropdownRef} className="absolute left-0 right-0 top-12 mt-1 bg-white border border-gray-300 shadow-md rounded-lg z-10">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-tn_dark hover:bg-gray-200"
                        >
                          Profile
                        </Link>
                        <LogoutBtn />
                      </div>
                    )}
                  </div>
                </li>
              ) : (
                <>
                  <li className="inline-block text-tn_dark text-lg font-medium">
                    <Link to={"/signup"}>{t("Signup")}</Link>
                  </li>
                  <li className="inline-block ml-4 rounded-md text-lg bg-black text-white py-1 px-4">
                    <Link to={"/login"}>Login</Link>
                  </li>
                </>
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
              <ul className="flex flex-col py-4 px-2 items-center bg-white shadow-lg fixed top-0 left-0 right-0 w-full h-screen duration-200 justify-center z-10 overflow-y-auto">
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
                            src={userData?.photoURL || fallback}
                            alt="user profile"
                            className="w-16 h-16 rounded-full"
                          />
                        </span>
                        {/* <LogoutBtn /> */}
                      </li>
                    ) : (
                      <>
                        <li className="inline-block px-7 rounded-md text-lg bg-tn_pink text-white py-1">
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
                    <li>
                      <LogoutBtn className="inline" />
                    </li>
                  </ul>

                  <h4 className="text-xl font-bold text-tn_pink mt-10 mb-4">
                    Contact
                  </h4>
                  <ul className=" text-base text-tn_dark font-medium">
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
                          className="w-7 h-7  object-contain"
                        />
                      </a>
                    </li>
                    <li>
                      <a href="#1">
                        <img
                          src={twitter}
                          className="w-7 h-7  object-contain"
                        />
                      </a>
                    </li>
                    <li>
                      <a href="#1">
                        <img src={fb} className="w-7 h-7 object-contain" />
                      </a>
                    </li>
                    <li>
                      <a href="#1">
                        <img
                          src={youtube}
                          className="w-7 h-7  object-contain"
                        />
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
            <LuShoppingBag onClick={() => {}} size={24} className="" />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
