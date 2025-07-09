import { FaLocationPin } from "react-icons/fa6";
import {
  cardLayout2,
  cardLayout4,
  cardLayout6,
  cardLayout8,
  fallback,
} from "../../assets";
import { Link } from "react-router-dom";

const restrictWordCount = (text, wordLimit) => {
  if (!text) return ""; // Handle null or undefined input
  const words = text.split(" ");
  if (words.length <= wordLimit) return text; // No need to truncate
  return words.slice(0, wordLimit).join(" ") + "...";
};

const LayoutCards = ({ profile, layout, type }) => {
  switch (layout) {
    case "1":
      return (
        <div className="rounded-3xl shadow-lg bg-white w-full h-[490px]">
          <div className="relative overflow-hidden">
            {type == "employee" ? (
              <Link to={`/employee-view/${profile?.id}`}>
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
                    className="transform mx-auto w-24 h-24 object-cover rounded-full z-10 border-4 border-white bg-white "
                  />
                  <span
                    className="absolute top-0 w-full h-full -z-10 flex items-center justify-center"
                    alt=""
                  >
                    {/* <span className="bg-orange-100 w-full h-[60%]"></span> */}
                    <img src={cardLayout2} alt="" className="w-full h-auto" />
                  </span>
                </div>
              </Link>
            ) : (
              <Link to={`/company/${profile?.id}`}>
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
                    className="transform mx-auto w-24 h-24 object-cover rounded-full z-10 border-4 border-white bg-white "
                  />
                  <span
                    className="absolute top-0 w-full h-full -z-10 flex items-center justify-center"
                    alt=""
                  >
                    {/* <span className="bg-orange-100 w-full h-[60%]"></span> */}
                    <img src={cardLayout2} alt="" className="w-full h-auto" />
                  </span>
                </div>
              </Link>
            )}
          </div>

          <div className="text-center p-4">
            <h3 className="text-xl font-semibold">
              {type == "employee" ? (
                <Link to={`/employee-view/${profile?.id}`}>
                  {profile?.title}
                </Link>
              ) : (
                <Link to={`/company/${profile?.id}`}>{profile?.title}</Link>
              )}
            </h3>
            <p className="text-gray-600 mt-2">
              {/* {restrictWordCount(profile?.description, 10)} */}
              {profile?.description}
            </p>
            {/* <div className="mt-6 gap-2 inline-flex items-center justify-center text-[#3C96B0] bg-[#E9FAFF] px-2 py-1 rounded-2xl">
              <FaLocationPin size={16} />

              {profile?.location}
            </div> */}
          </div>
        </div>
      );

    case "2":
      return (
        <div className="rounded-3xl shadow-lg bg-white w-full h-[490px]">
          <div className="relative overflow-hidden">
            {type == "employee" ? (
              <Link to={`/employee-view/${profile?.id}`}>
                <div className="h-[278px] rounded-t-3xl overflow-hidden relative">
                  <img
                    src={cardLayout4}
                    alt={profile?.title}
                    className="h-full w-full -z-0"
                  />
                  <div className="w-full h-auto absolute bottom-10 left-0 right-0">
                    <img
                      src={profile?.image}
                      alt={profile?.title}
                      className="transform mx-auto w-24 h-24 object-cover rounded-full z-10 border-4 border-white bg-white shadow-lg"
                    />
                  </div>
                </div>
              </Link>
            ) : (
              <Link to={`/company/${profile?.id}`}>
                <div className="h-[278px] rounded-t-3xl overflow-hidden relative">
                  <img
                    src={cardLayout4}
                    alt={profile?.title}
                    className="h-full w-full -z-0"
                  />
                  <div className="w-full h-auto absolute bottom-10 left-0 right-0">
                    <img
                      src={profile?.image}
                      alt={profile?.title}
                      className="transform mx-auto w-24 h-24 object-cover rounded-full z-10 border-4 border-white bg-white shadow-lg"
                    />
                  </div>
                </div>
              </Link>
            )}
          </div>
          <div className="text-center px-4">
            <h3 className="text-xl font-semibold">
              {type == "employee" ? (
                <Link to={`/employee-view/${profile?.id}`}>
                  {profile?.title}
                </Link>
              ) : (
                <Link to={`/company/${profile?.id}`}>{profile?.title}</Link>
              )}
            </h3>
            <p className="text-gray-600 mt-2">
              {/* {restrictWordCount(profile?.description, 10)} */}
              {profile?.description}
            </p>
            {/* <div className="mt-6 gap-2 inline-flex items-center justify-center text-[#3C96B0] bg-[#E9FAFF] px-2 py-1 rounded-2xl">
              <FaLocationPin size={16} />
              {profile?.location}
            </div> */}
          </div>
        </div>
      );

    case "3":
      return (
        <div className="rounded-3xl shadow-lg bg-white w-full h-[490px]">
          <div className="relative overflow-hidden">
            {type == "employee" ? (
              <Link to={`/employee-view/${profile?.id}`}>
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
                      src={cardLayout6}
                      alt=""
                      className="w-full h-full -z-0"
                    />
                  </span>
                </div>
                <div className="w-full flex justify-end transform -mt-16 relative pb-4">
                  <img
                    src={profile?.image}
                    alt={profile?.title}
                    className="transform w-24 h-24 mr-[70px] object-content rounded-full z-10 border-4 border-white shadow-lg bg-white"
                  />
                </div>
              </Link>
            ) : (
              <Link to={`/company/${profile?.id}`}>
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
                      src={cardLayout6}
                      alt=""
                      className="w-full h-full -z-0"
                    />
                  </span>
                </div>
                <div className="w-full flex justify-end transform -mt-16 relative pb-4">
                  <img
                    src={profile?.image}
                    alt={profile?.title}
                    className="transform w-24 h-24 mr-[70px] object-content rounded-full z-10 border-4 border-white shadow-lg bg-white"
                  />
                </div>
              </Link>
            )}
          </div>
          <div className="text-start px-4">
            <h3 className="text-xl font-semibold">
              {type == "employee" ? (
                <Link to={`/employee-view/${profile?.id}`}>
                  {profile?.title}
                </Link>
              ) : (
                <Link to={`/company/${profile?.id}`}>{profile?.title}</Link>
              )}
            </h3>
            <p className="text-gray-600 mt-2">
              {/* {restrictWordCount(profile?.description, 10)} */}
              {profile?.description}
            </p>
            {/* <div className="mt-6 gap-2 inline-flex items-center justify-center text-[#3C96B0] bg-[#E9FAFF] px-2 py-1 rounded-2xl">
              <FaLocationPin size={16} />
              {profile?.location}
            </div> */}
          </div>
        </div>
      );

    case "4":
      return (
        <div className="rounded-3xl shadow-lg bg-white w-full h-[490px]">
          {type == "employee" ? (
            <Link to={`/employee-view/${profile?.id}`}>
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
                    <img
                      src={cardLayout8}
                      alt=""
                      className="w-full h-full -z-0"
                    />
                  </span>
                </div>
                <div className="w-full flex justify-end transform -mt-16 relative pb-4">
                  <img
                    src={profile?.image}
                    alt={profile?.title}
                    className="transform w-24 h-24 mx-auto object-content rounded-full z-10 border-4 border-white shadow-lg bg-white"
                  />
                </div>
              </div>
            </Link>
          ) : (
            <Link to={`/company/${profile?.id}`}>
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
                    <img
                      src={cardLayout8}
                      alt=""
                      className="w-full h-full -z-0"
                    />
                  </span>
                </div>
                <div className="w-full flex justify-end transform -mt-16 relative pb-4">
                  <img
                    src={profile?.image}
                    alt={profile?.title}
                    className="transform w-24 h-24 mx-auto object-content rounded-full z-10 border-4 border-white shadow-lg bg-white"
                  />
                </div>
              </div>
            </Link>
          )}

          <div className="text-start px-4">
            <h3 className="text-xl font-semibold">
              {type == "employee" ? (
                <Link to={`/employee-view/${profile?.id}`}>
                  {profile?.title}
                </Link>
              ) : (
                <Link to={`/company/${profile?.id}`}>{profile?.title}</Link>
              )}
            </h3>
            {/* <div className="my-4 gap-2 inline-flex items-center justify-center text-[#3C96B0] bg-[#E9FAFF] px-2 py-1 rounded-2xl">
              <FaLocationPin size={16} />
              {profile?.location}
            </div> */}
            <p className="text-gray-600 mt-2">
              {/* {restrictWordCount(profile?.description, 10)} */}
              {profile?.description}
            </p>
          </div>
        </div>
      );

    default:
      return <div>No Layout Selected</div>;
  }
};

export default LayoutCards;
