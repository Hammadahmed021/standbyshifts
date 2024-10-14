import React from 'react';
import { FaBox, FaEnvelope, FaMailBulk, FaMailchimp, FaMarker, FaPhone, FaPhoneAlt, FaPuzzlePiece, FaSms, FaVoicemail } from 'react-icons/fa';
import { FaFileZipper, FaLocationDot, FaLocationPin, FaMessage } from 'react-icons/fa6';

const CompanyProfiles = ({ profile, layout }) => {
  const renderLayout = () => {
    switch (layout) {
      case '1':
        return (
          <>
          <div className="bg-blue-950 w-full h-[250px]"></div>
          <div className="p-6 flex justify-start items-center text-left space-x-5 container">
            <div className="first_col -mt-24">
            <img
              src={profile?.employer?.logo}
              alt={profile?.name}
              className="rounded-full w-40 h-40 mx-auto"
            /></div>
            <div className="second_col">
            <h2 className="text-xl font-bold mt-4">{profile?.name}</h2>
            <p className="text-gray-600 mt-2">{profile?.industry || 'Industry not provided'}</p>
            <p className="text-gray-600 mt-2">{profile?.jobPostCount || 'jobPostCount'}</p>
            <div className="mt-2 flex space-x-2 items-center">
              <h3 className="text-lg font-semibold">Contact Information:</h3>
              <p className="bg-tn_green bg-opacity-20 p-2 rounded-full text-tn_green inline-flex items-center gap-2"><FaEnvelope /><strong>Email:</strong> {profile?.email}</p>
              <p className="bg-tn_purple bg-opacity-20 p-2 rounded-full text-tn_purple inline-flex items-center gap-2"><FaPhoneAlt /><strong>Phone:</strong> {profile?.phone}</p>
              <p className="bg-tn_brown bg-opacity-20 p-2 rounded-full text-tn_brown inline-flex items-center gap-2"><FaLocationDot /><strong>Location:</strong> {profile?.employer?.location}</p>
              <p className="bg-tn_green bg-opacity-20 p-2 rounded-full text-tn_green inline-flex items-center gap-2"><FaFileZipper /><strong>Zip Code:</strong> {profile?.employer?.zip_code}</p>
            </div>
          </div>
          </div>
          
          </>

        );
      case '2':
        return (
          <div className="bg-gray-100 shadow-md p-6 rounded-lg flex flex-col items-center text-center">
            <div className="w-full bg-gray-200 p-4 rounded-t-lg">
              <img
                src={profile?.employer?.logo}
                alt={profile?.name}
                className="rounded-full w-24 h-24 mx-auto"
              />
            </div>
            <h2 className="text-xl font-bold mt-4">{profile?.name}</h2>
            <p className="text-gray-600 mt-2">{profile?.industry?.title || 'Industry not provided'}</p>
            <div className="flex justify-between w-full mt-6">
              <div>
                <h3 className="font-semibold">Email</h3>
                <p>{profile?.email}</p>
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p>{profile?.phone}</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Location</h3>
              <p>{profile?.employer?.location}</p>
              <p>{profile?.employer?.zip_code}</p>
            </div>
          </div>
        );
      case '3':
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
              <p className="text-gray-600 mt-2">{profile?.industry?.title || 'Industry not provided'}</p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <p><strong>Email:</strong> {profile?.email}</p>
                <p><strong>Phone:</strong> {profile?.phone}</p>
                <p><strong>Location:</strong> {profile?.employer?.location}</p>
                <p><strong>Zip Code:</strong> {profile?.employer?.zip_code}</p>
              </div>
            </div>
          </div>
        );
      case '4':
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
            <p className="text-gray-400 mt-2">{profile?.industry?.title || 'Industry not provided'}</p>
            <div className="w-full mt-6 text-center">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <p><strong>Email:</strong> {profile?.email}</p>
              <p><strong>Phone:</strong> {profile?.phone}</p>
              <p><strong>Location:</strong> {profile?.employer?.location}</p>
              <p><strong>Zip Code:</strong> {profile?.employer?.zip_code}</p>
            </div>
          </div>
        );
      default:
        return <p>Invalid layout</p>;
    }
  };

  return (
    <div>
      {renderLayout()}
    </div>
  );
};

export default CompanyProfiles;
