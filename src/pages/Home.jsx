import React, { useState, useEffect } from "react";
import useMediaQuery from "../hooks/useQuery";
import Filter from "../component/Filter";
import { Button, CardCarousel, LoadMore, Carousel, Search } from "../component";
import { Fav, App, storeBtn, fallback } from "../assets";
import { localDB } from "../utils/localDB";
import useFetch from "../hooks/useFetch";
import { transformData } from "../utils/HelperFun";

export default function Home() {
  const isDesktop = useMediaQuery("(max-width: 991px)");

  const [visibleCards, setVisibleCards] = useState(4);
  const [visibleAllCards, setVisibleAllCards] = useState(4);

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

  const { loading, data, error } = useFetch("filter");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const transformedData = data ? transformData(data) : [];

  const hasMore = visibleCards < transformedData.length;
  const hasAllMore = visibleAllCards < transformedData.length;

  const handleAllLoadMore = () => {
    setVisibleAllCards((prevVisibleCards) => prevVisibleCards + 4);
  };

  const handleLoadMore = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards + 4);
  };

  return (
    <>
      <h1 className="vxs:w-[65%] sm:w-[70%] md:w-[75%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%] my-8 text-3xl sc-1920:w-[40%] mx-auto sm:text-5xl font-extrabold text-center sm:my-14">
        Discover and Book the Best
        <span className="text-tn_pink"> Restaurant</span>
      </h1>
      {isDesktop ? (
        <div className="container w-[95%] mx-auto relative">
          <Search data={data} className={'ml-0'}/>
        </div>
      ) : (
        <div className="container mx-auto">
          <div className="w-full inline-flex justify-center">
            <Filter onFilterChange={handleFilterChange} />
          </div>
        </div>
      )}

      <div className="bg-hero sm:h-[439px] h-[250px] sm:my-16 my-12 bg-no-repeat bg-cover">
        <div className="container h-full flex items-center sm:items-end">
          <div className="lg:w-4/5 w-full">
            <img src={Fav} alt="" className="hidden sm:block" />
            <p className="text-white text-2xl hidden sm:block">
              Popular food & restaurants near you
            </p>
            <h2 className=" mb-0   text-3xl w-full text-white sm:text-4xl md:text-5xl font-extrabold sm:mb-14 sm:w-[70%]  sm:text-start text-center">
              Your next favorite restaurant is a few taps away.
            </h2>
          </div>
        </div>
      </div>

      <div className="container mx-auto ">
        <div className="flex justify-between mb-10 sm:mb-14 flex-col sm:flex-row items-end">
          <div className="text-center sm:text-start">
            <h2 className="text-3xl w-full text-black sm:text-4xl md:text-5xl font-extrabold ">
              Restaurants Near You
            </h2>
            <p className="text-lg font-normal text-black py-2 sm:py-0">
              Popular types of food & restaurants near you
            </p>
          </div>
          <Button
            children={"View All"}
            bgColor="transparent"
            className="border border-black h-min mt-1 hover:bg-tn_pink hover:text-white hover:border-tn_pink duration-200 sm:inline-block block sm:w-auto w-[90%] m-auto sm:m-0"
            textColor="text-black"
            onClick={() => alert("test")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 ">
          {transformedData.slice(0, visibleCards).map((data) => (
            <CardCarousel
              key={data.id}
              id={data.id}
              title={data.title}
              location={data.location}
              images={data.images}
              rating={data.rating}
              cuisine={data.cuisine}
              timeline={data.timeline}
            />
          ))}
        </div>
        <LoadMore
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          className={"mt-5"}
        />

        {/* Featured Carousel */}
        <div className="mt-20">
          <div className="flex justify-between mb-10 sm:mb-14 flex-col sm:flex-row items-end">
            <div className="text-center sm:text-start">
              <h2 className="text-3xl w-full text-black sm:text-4xl md:text-5xl font-extrabold ">
                Featured Restaurants
              </h2>
              <p className="text-lg font-normal text-black py-2 sm:py-0">
                Checkout some of our Best Featured Restaurants of all the time
              </p>
            </div>
            <Button
              children={"View All"}
              bgColor="transparent"
              className="border border-black h-min mt-1 hover:bg-tn_pink hover:text-white hover:border-tn_pink duration-200 sm:inline-block block sm:w-auto w-[90%] m-auto sm:m-0"
              textColor="text-black"
              onClick={() => alert("test")}
            />
          </div>
          <Carousel>
            {localDB
              .filter((data) => data.type === "featured")
              .map((data, index) => (
                <CardCarousel
                  key={index}
                  id={data.id}
                  title={data.title}
                  location={data.location}
                  images={data.images}
                  type={data.type}
                />
              ))}
          </Carousel>
        </div>
      </div>

      <div className="container mx-auto ">
        <div className="bg-appbanner sm:h-[439px] h-[220px] my-16 bg-no-repeat bg-cover px-2 lg:px-8 flex flex-wrap items-center justify-center sm:justify-between bg-right">
          <div className="w-2/5 h-full pt-4 hidden lg:block">
            <img
              src={App}
              alt=""
              className="h-full object-cover w-[90%] lg:w-full"
            />
          </div>
          <div className="lg:w-3/5 w-4/5">
            <p className="text-white text-2xl hidden sm:block">
              Popular food & restaurants near you
            </p>
            <h2 className=" mb-2 text-3xl w-full text-white sm:text-4xl md:text-5xl font-extrabold sm:mb-4 lg:w-[80%]  sm:text-start text-center">
              Download our all new Mobile App
            </h2>
            <img src={storeBtn} alt="" className="mx-auto sm:mx-0" />
          </div>
        </div>
      </div>
      <div className="container mx-auto pb-10">
        <div className="flex justify-between mb-10 sm:mb-14 flex-col sm:flex-row items-end">
          <div className="text-center sm:text-start ">
            <h2 className="text-3xl w-full text-black sm:text-4xl md:text-5xl font-extrabold ">
              Browse all our Best Restaurants
            </h2>
            <p className="text-lg font-normal text-black py-2 sm:py-0">
              Explore all listed Restaurants we have | Popular types of food &
              restaurants near you
            </p>
          </div>
          <Button
            children={"View All"}
            bgColor="transparent"
            className="border border-black h-min mt-1 hover:bg-tn_pink hover:text-white hover:border-tn_pink duration-200 sm:inline-block block sm:w-auto w-[90%] m-auto sm:m-0"
            textColor="text-black"
            onClick={() => alert("test")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 ">
          {transformedData.slice(0, visibleAllCards).map((data, index) => (
            <CardCarousel
              key={index} // Assuming data.id is a unique identifier for each item
              id={data.id}
              title={data.title}
              location={data.location}
              images={data.images}
              rating={data.rating}
              cuisine={data.cuisine}
              timeline={data.timeline}
            />
          ))}
        </div>
        <LoadMore
          onLoadMore={handleAllLoadMore}
          hasMore={hasAllMore}
          className={"mt-5"}
        />
      </div>
    </>
  );
}
