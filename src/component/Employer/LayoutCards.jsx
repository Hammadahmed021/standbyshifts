import { FaLocationPin } from "react-icons/fa6";
import {
  cardLayout1,
  cardLayout3,
  cardLayout5,
  cardLayout7,
  fallback,
} from "../../assets";
import { Link } from "react-router-dom";

const restrictWordCount = (text, wordLimit) => {
  if (!text) return ""; // Handle null or undefined input
  const words = text.split(" ");
  if (words.length <= wordLimit) return text; // No need to truncate
  return words.slice(0, wordLimit).join(" ") + "...";
};

const LayoutCards = ({ profile, layout, type = "employee" }) => {
  switch (layout) {
    case "1":
      return (
        <div className="rounded-3xl shadow-lg bg-white w-full h-[490px]">
          <div className="relative overflow-hidden">
            <div className="h-56 rounded-t-3xl overflow-hidden">
              <img
                src={profile?.bannerImg || fallback}
                alt={profile?.title}
                className="h-full w-full rounded-t-3xl"
              />
            </div>
            <div className="w-full transform -mt-14 relative">
              <img
                src={profile?.image}
                alt={profile?.title}
                className="transform mx-auto w-24 h-24 object-cover rounded-full z-10 border-4 border-white bg-gray-50 "
              />
              <span
                className="absolute top-0 w-full h-full -z-10 flex items-center justify-center"
                alt=""
              >
                {/* <span className="bg-orange-100 w-full h-[60%]"></span> */}
                <img src={cardLayout1} alt="" className="w-full h-auto" />
              </span>
            </div>
          </div>
          <div className="text-center p-4">
            <h3 className="text-xl font-semibold">
              {type == "employer" ? (
                <Link to={`/employee-view/${profile?.id}`}>
                  {profile?.title}
                </Link>
              ) : (
                <Link to={`/company/${profile?.id}`}>{profile?.title}</Link>
              )}
            </h3>
            <p className="text-gray-600 mt-2">
              {restrictWordCount(profile?.description, 15)}
            </p>
            <div className="mt-6 gap-2 inline-flex items-center justify-center text-[#3C96B0] bg-[#E9FAFF] px-2 py-1 rounded-2xl">
              <FaLocationPin size={16} />

              {profile?.location}
            </div>
          </div>
        </div>
      );

    case "2":
      return (
        <div className="rounded-3xl shadow-lg bg-white w-full h-[490px]">
          <div className="relative overflow-hidden">
            <div className="h-[278px] rounded-t-3xl overflow-hidden relative">
              <img
                src={cardLayout3}
                alt={profile?.title}
                className="h-full w-full -z-0"
              />
              <div className="w-full h-auto absolute bottom-10 left-0 right-0">
                <img
                  src={profile?.image}
                  alt={profile?.title}
                  className="transform mx-auto w-24 h-24 object-cover rounded-full z-10 border-4 border-white bg-gray-50 shadow-lg"
                />
              </div>
            </div>
          </div>
          <div className="text-center px-4">
            <h3 className="text-xl font-semibold">
              <Link to={`/company/${profile?.id}`}>{profile?.title}</Link>
            </h3>
            <p className="text-gray-600 mt-2">
              {restrictWordCount(profile?.description, 15)}
            </p>
            <div className="mt-6 gap-2 inline-flex items-center justify-center text-[#3C96B0] bg-[#E9FAFF] px-2 py-1 rounded-2xl">
              <FaLocationPin size={16} />
              {profile?.location}
            </div>
          </div>
        </div>
      );

    case "3":
      return (
        <div className="rounded-3xl shadow-lg bg-white w-full h-[490px]">
          <div className="relative overflow-hidden">
            <div className="h-52 rounded-t-3xl relative overflow-hidden">
              <img
                src={profile?.bannerImg || fallback}
                alt={profile?.title}
                className="h-full w-full -z-10 rounded-t-3xl"
              />
              <span
                className="absolute top-6 w-full h-48 -z-0 flex items-center justify-center"
                alt=""
              >
                {/* <span className="bg-orange-100 w-full h-[60%]"></span> */}
                <img
                  src={cardLayout5}
                  alt=""
                  className="w-full h-full object-cover -z-0"
                />
              </span>
            </div>
            <div className="w-full flex justify-end transform -mt-16 relative pb-4">
              <img
                src={profile?.image}
                alt={profile?.title}
                className="transform w-24 h-24 mr-[70px] object-cover rounded-full z-10 border-4 border-white shadow-lg"
              />
            </div>
          </div>
          <div className="text-start px-4">
            <h3 className="text-xl font-semibold">
              <Link to={`/company/${profile?.id}`}>{profile?.title}</Link>
            </h3>
            <p className="text-gray-600 mt-2">
              {restrictWordCount(profile?.description, 15)}
            </p>
            <div className="mt-6 gap-2 inline-flex items-center justify-center text-[#3C96B0] bg-[#E9FAFF] px-2 py-1 rounded-2xl">
              <FaLocationPin size={16} />
              {profile?.location}
            </div>
          </div>
        </div>
      );

    case "4":
      return (
        <div className="rounded-3xl shadow-lg bg-white w-full h-[490px]">
          <div className="relative overflow-hidden">
            <div className="h-56 rounded-t-3xl relative ">
              <img
                src={profile?.bannerImg || fallback}
                alt={profile?.title}
                className="h-full w-full -z-10 rounded-t-3xl"
              />
              <span
                className="absolute top-4 w-full h-56 -z-0 flex items-center justify-center"
                alt=""
              >
                {/* <span className="bg-orange-100 w-full h-[60%]"></span> */}
                <img src={cardLayout7} alt="" className="w-full h-full -z-0" />
              </span>
            </div>
            <div className="w-full flex justify-end transform -mt-16 relative pb-4">
              <img
                src={profile?.image}
                alt={profile?.title}
                className="transform w-24 h-24 mx-auto object-cover rounded-full z-10 border-4 border-white shadow-lg"
              />
            </div>
          </div>
          <div className="text-start px-4">
            <h3 className="text-xl font-semibold">
              <Link to={`/company/${profile?.id}`}>{profile?.title}</Link>
            </h3>
            <div className="my-4 gap-2 inline-flex items-center justify-center text-[#3C96B0] bg-[#E9FAFF] px-2 py-1 rounded-2xl">
              <FaLocationPin size={16} />
              {profile?.location}
            </div>
            <p className="text-gray-600 mt-2">
              {restrictWordCount(profile?.description, 15)}
            </p>
          </div>
        </div>
      );

    default:
      return <div>No Layout Selected</div>;
  }
};

export default LayoutCards;
