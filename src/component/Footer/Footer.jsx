import React, { useState } from "react";
import { Link } from "react-router-dom";
import { infoLinks, supportLinks } from "../../utils/localDB";
import { Logo, fb, instagram, twitter, youtube } from "../../assets"; 
import { useSelector } from "react-redux";

const Footer = () => {
  const userData = useSelector((state) => state.auth.userData);
  const userType = userData?.user?.type || localStorage.getItem("userType"); // Fetch user type


  return (
    <footer className="bg-tn_dark text-white">
      <div className="border-t-2 border-b-2 border-tn_light_grey pt-10 pb-4">
        <div class="flex flex-wrap container mx-auto">
          {/* <!-- 40% Column --> */}
          <div class="w-full md:w-2/5 py-2 sm:py-4">
            <Link to={
              userData
                ? userType === "employee"
                  ? "employee"
                  : "employer"
                : "/"
            }>
              <img src={Logo} alt="" className="w-32" />
            </Link>
            <p className="py-6 mr-0 sm:mr-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus
              lorem id penatibus imperdiet. Turpis egestas ultricies purus
              auctor tincidunt lacus nunc.
            </p>
            <p>Turpis egestas ultricies purus auctor tincidunt lacus nunc.</p>
          </div>

          {/* <!-- 60% Column --> */}
          <div class="w-full md:w-3/5 py-2 sm:py-4">
            {/* <!-- Nested 3 Columns --> */}
            <div class="flex flex-wrap space-x-0 md:space-x-0">
              <div class="w-full md:w-1/3 p-2 pl-0 lg:pl-12">
                <h3 class="text-lg font-extrabold mb-4">Contact</h3>
                <ul className="flex flex-col">
                  <li className="lg:text-base md:text-sm ">
                    <a href="tel:+12 345 678 000">+12 345 678 000</a>
                  </li>
                  <li className="lg:text-base md:text-sm ">
                    <a href="mailto:info@tablenow.com">info@standbyshifts.com</a>
                  </li>
                  <li className="mt-2 sm:mt-5  w-full sm:w-[100%] lg:text-base md:text-sm ">
                    7262 Sepulveda Blvd. Culver City, CA, 90230
                  </li>
                </ul>
              </div>
              <div class="w-full md:w-1/3 p-2 pl-0 lg:pl-12">
                <h3 class="text-lg font-extrabold mb-4">Info</h3>
                <ul className="flex flex-col">
                  {Object.entries(infoLinks).map(([name, url], index) => (
                    <li key={index} className="mb-2 lg:text-base md:text-sm ">
                      <Link
                        to={url}
                        target="_blank"
                        className="hover:underline"
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div class="w-full md:w-1/3 p-2 pl-0 lg:pl-12">
                <h3 class="text-lg font-extrabold mb-4">Support</h3>
                <ul className="flex flex-col">
                  {Object.entries(supportLinks).map(([name, url], index) => (
                    <li key={index} className="mb-2 lg:text-base md:text-sm ">
                      <Link to={url} className="hover:underline">
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="footer-bottom py-4 flex justify-between container mx-auto items-center">
        <p>© 2024 Stand by shifts | All rights Reserved</p>
        <div className="flex items-center">

          <ul className="flex flex-wrap justify-between space-x-4 mt-6 sm:mt-0">
            <li>
              <a href="#1">
                <img src={instagram} className="w-7 h-7  object-contain invert" />
              </a>
            </li>
            <li>
              <a href="#1">
                <img src={twitter} className="w-7 h-7  object-contain invert" />
              </a>
            </li>
            <li>
              <a href="#1">
                <img src={fb} className="w-7 h-7 object-contain invert" />
              </a>
            </li>
            <li>
              <a href="#1">
                <img src={youtube} className="w-7 h-7  object-contain invert" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
