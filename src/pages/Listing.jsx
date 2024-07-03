import React, { useState } from "react";
import { CardCarousel, LoadMore, SelectOption, Checkbox } from "../component";
import useFetch from "../hooks/useFetch";
import { transformData } from "../utils/HelperFun";
import { facilities, city, cuisine, guest, times } from "../utils/localDB";

const Listing = () => {
  const [visibleCards, setVisibleCards] = useState(6);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedGuest, setSelectedGuest] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  const { loading, data, error } = useFetch("filter");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const transformedData = data ? transformData(data) : [];
  const handleLoadMore = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards + 4);
  };

  const hasMore = visibleCards < transformedData.length;

  const handleCuisineChange = (id) => {
    setSelectedCuisine((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleFacilitiesChange = (id) => {
    setSelectedFacilities((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="bg-hero sm:h-[439px] h-[250px] mb-6 bg-no-repeat bg-cover">
        <div className="container h-full flex items-center sm:items-end">
          <div className="lg:w-4/5 w-full">
            <p className="text-white text-2xl hidden sm:block">
              Top-Rated Food and Restaurants Nearby
            </p>
            <h2 className="mb-0 text-3xl w-full text-white sm:text-4xl md:text-5xl font-extrabold sm:mb-14 sm:w-[70%] sm:text-start text-center">
              Filter out Our Best Restaurants & Make Reservation.
            </h2>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-3 p-2">
            <div className="block mb-6">
              <h3 className="text-2xl font-bold text-tn_dark ">City</h3>
              <SelectOption
                // label="Select City"
                options={city}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="mx-0 py-1 px-2 border border-tn_light_grey rounded-md mt-3"
              />
            </div>
            <div className="block mb-6">
              <h3 className="text-2xl font-bold text-tn_dark">Cuisine</h3>
              <Checkbox
                // label="Select Cuisine"
                showLabel={cuisine}
                options={cuisine}
                selectedOptions={selectedCuisine}
                onChange={handleCuisineChange}
              />
            </div>
            <div className="block mb-6">
              <h3 className="text-2xl font-bold text-tn_dark">Arrival Time</h3>
              <SelectOption
                // label="Time"
                options={times}
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="mx-0 py-1 px-2 border border-tn_light_grey rounded-md mt-3"
              />
            </div>
            <div className="block mb-6">
              <h3 className="text-2xl font-bold text-tn_dark">
                Persons/Guests
              </h3>
              <SelectOption
                // label="Number of Guests"
                options={guest}
                value={selectedGuest}
                onChange={(e) => setSelectedGuest(e.target.value)}
                className="mx-0 py-1 px-2 border border-tn_light_grey rounded-md mt-3"
              />
            </div>

            <div className="block mb-6">
              <h3 className="text-2xl font-bold text-tn_dark">
                Available Facilities
              </h3>
              <Checkbox
                // label="Select Facilities"
                showLabel={facilities}
                options={facilities}
                selectedOptions={selectedFacilities}
                onChange={handleFacilitiesChange}
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            {/* Content for the 9-column section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-0">
              {transformedData.slice(0, visibleCards).map((data) => (
                <CardCarousel
                  key={data.id}
                  id={data.id}
                  title={data.title}
                  location={data.location}
                  images={data.images}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Listing;
