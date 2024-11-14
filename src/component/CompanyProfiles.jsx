import React from "react";
import { BsBackpack2Fill } from "react-icons/bs";
import {
  FaBox,
  FaEnvelope,
  FaMailBulk,
  FaMailchimp,
  FaMarker,
  FaPhone,
  FaPhoneAlt,
  FaPuzzlePiece,
  FaSms,
  FaVoicemail,
} from "react-icons/fa";
import {
  FaFileZipper,
  FaLocationDot,
  FaLocationPin,
  FaMessage,
} from "react-icons/fa6";
import { avatar, ImgB } from "../assets";

const CompanyProfiles = ({ profile, layout, count }) => {
  const renderLayout = () => {
    switch (layout) {
      case "1":
        return (
          <>
            <div className="bg-blue-950 w-full h-[250px]"></div>
            <div className="p-6 flex flex-wrap justify-center sm:justify-start items-center text-left sm:space-x-5 container">
              <div className="first_col -mt-16 sm:-mt-24">
                <img
                  src={profile?.employer?.logo || avatar}
                  alt={profile?.name}
                  className="rounded-full w-32 h-32 sm:w-44 sm:h-44 mx-auto shadow-md object-cover"
                />
              </div>
              <div className="second_col text-center sm:text-left mt-4 sm:mt-0">
                <h2 className="text-2xl sm:text-4xl font-bold mb-4">{profile?.name}</h2>
                <div className="flex flex-wrap justify-center gap-2">
                  <p className="bg-tag_green bg-opacity-20 p-2 rounded-full text-tag_green inline-flex items-center gap-2 text-sm">
                    <BsBackpack2Fill /> Total Jobs: {count || "N/A"}
                  </p>
                  <p className="bg-tag_purple bg-opacity-20 p-2 rounded-full text-tag_purple inline-flex items-center gap-2 text-sm">
                    <FaFileZipper />
                    Zip Code: {profile?.employer?.zip_code}
                  </p>
                  <p className="bg-tag_brown bg-opacity-20 p-2 rounded-full text-tag_brown inline-flex items-center gap-2 text-sm">
                    <FaLocationDot />
                    Industry: {profile?.industry}
                  </p>
                </div>
              </div>
            </div>
            <div className="container gap-4 flex flex-wrap sm:flex-nowrap items-start justify-between">
              <div className="w-full sm:w-8/12 shadow-xl rounded-2xl bg-white p-4">
                <h3 className="text-lg font-semibold mb-6">About Company</h3>
                <p>{profile?.about}</p>
              </div>
              <div className="w-full sm:w-4/12 shadow-xl rounded-2xl bg-white p-4">
                <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
                  <h4 className="text-sm text-tag_purple  bg-tag_purple  bg-opacity-20  px-2 py-1 rounded-2xl flex justify-between items-center gap-2">
                    <FaEnvelope /> Email
                  </h4>
                  <p className="font-semibold truncate">{profile?.email}</p>
                </div>
                <hr className="border-b border-tn_light_grey my-6" />

                <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
                  <h4 className="text-sm text-tag_brown  bg-tag_brown  bg-opacity-20  px-2 py-1 rounded-2xl flex justify-between items-center gap-2">
                    <FaPhoneAlt /> Phone
                  </h4>
                  <p className="font-semibold truncate">{profile?.phone}</p>
                </div>
                <hr className="border-b border-tn_light_grey my-6" />
                <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
                  <h4 className="text-sm text-tag_green  bg-tag_green  bg-opacity-20  px-2 py-1 rounded-2xl flex justify-between items-center gap-2">
                    <FaLocationDot /> Location
                  </h4>
                  <p className="font-semibold truncate">{profile?.employer?.location}</p>
                </div>
              </div>
            </div>
          </>
        );
      case "2":
        return (
          <>
            <div className="bg-blue-950 w-full h-[250px] container rounded-2xl"></div>
            <div className="container flex flex-col items-center text-center">
              <div className="-mt-16 sm:-mt-24">
                <img
                  src={profile?.employer?.logo || avatar}
                  alt={profile?.name}
                  className="rounded-full w-32 h-32 sm:w-44 sm:h-44 mx-auto shadow-md"
                />
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold my-6">{profile?.name}</h2>
              <div className="flex flex-wrap gap-2 justify-center space-x-2 items-center w-full mt-6">
                <p className="bg-tag_green bg-opacity-20 p-2 rounded-full text-tag_green inline-flex items-center gap-2 text-sm">
                  <BsBackpack2Fill /> Total Jobs {count || "N/A"}
                </p>
                <p className="bg-tag_brown bg-opacity-20 p-2 rounded-full text-tag_brown inline-flex items-center gap-2 text-sm">
                  <FaLocationDot />
                  {profile?.industry}
                </p>
                <p className="bg-tag_purple bg-opacity-20 p-2 rounded-full text-tag_purple inline-flex items-center gap-2 text-sm">
                  <FaFileZipper />
                  {profile?.employer?.zip_code}
                </p>
                <p className="bg-tag_green bg-opacity-20 p-2 rounded-full text-tag_green inline-flex items-center gap-2 text-sm">
                  <FaEnvelope /> {profile?.email}
                </p>
                <p className="bg-tag_brown bg-opacity-20 p-2 rounded-full text-tag_brown inline-flex items-center gap-2 text-sm">
                  <FaPhoneAlt /> {profile?.phone}
                </p>
                <p className="bg-tag_purple bg-opacity-20 p-2 rounded-full text-tag_purple inline-flex items-center gap-2 text-sm">
                  <FaLocationDot /> {profile?.employer?.location}
                </p>
              </div>
              <div className="my-10">
                <h3 className="text-lg font-semibold mb-6">About Company</h3>
                <p>{profile?.about}</p>
              </div>
            </div>
          </>
        );
      case "3":
        return (
          <div className="bg-blue-50 p-6 rounded-lg md:flex md:flex-row">
            <div className="w-full md:w-1/3 flex justify-center md:justify-start">
              <img
                src={profile?.employer?.logo}
                alt={profile?.name}
                className="rounded-full w-32 h-32"
              />
            </div>
            <div className="w-full md:w-2/3 text-left mt-4 md:mt-0 md:pl-6">
              <h2 className="text-xl font-bold">{profile?.name}</h2>
              <p className="text-gray-600 mt-2">
                {profile?.industry?.title || "Industry not provided"}
              </p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <p>
                  <strong>Email:</strong> {profile?.email}
                </p>
                <p>
                  <strong>Phone:</strong> {profile?.phone}
                </p>
                <p>
                  <strong>Location:</strong> {profile?.employer?.location}
                </p>
                <p>
                  <strong>Zip Code:</strong> {profile?.employer?.zip_code}
                </p>
              </div>
            </div>
          </div>
        );
      case "4":
        return (
          <div className="bg-gray-900 text-white p-6 rounded-lg flex flex-col items-center">
            <div className="bg-gray-800 p-4 rounded-t-lg w-full flex justify-center">
              <img
                src={profile?.employer?.logo}
                alt={profile?.name}
                className="rounded-full w-28 h-28"
              />
            </div>
            <h2 className="text-xl font-bold mt-4">{profile?.name}</h2>
            <p className="text-gray-400 mt-2">
              {profile?.industry?.title || "Industry not provided"}
            </p>
            <div className="w-full mt-6 text-center">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <p>
                <strong>Email:</strong> {profile?.email}
              </p>
              <p>
                <strong>Phone:</strong> {profile?.phone}
              </p>
              <p>
                <strong>Location:</strong> {profile?.employer?.location}
              </p>
              <p>
                <strong>Zip Code:</strong> {profile?.employer?.zip_code}
              </p>
            </div>
          </div>
        );
      default:
        return <p>Invalid layout</p>;
    }
  };

  return <div>{renderLayout()}</div>;
};

export default CompanyProfiles;
