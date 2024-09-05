import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import CardCarousel from "../component/CardCarousel";
import LoadMore from "../component/Loadmore";
import Checkbox from "../component/Checkbox";
import SelectOption from "../component/SelectOption";
import { dataForFilter, fetchFilteredData } from "../utils/Api";
import { transformSingleImageData } from "../utils/HelperFun";
import { Loader } from "../component";

const Listing = () => {
  const location = useLocation();
  const [filters, setFilters] = useState({
    kitchen_ids: Array.isArray(location.state?.filters?.kitchens)
      ? location.state?.filters?.kitchens
      : [location.state?.filters?.kitchens],
    facility_ids: Array.isArray(location.state?.filters?.facilities)
      ? location.state?.filters?.facilities
      : [location.state?.filters?.facilities],
    areas_ids: Array.isArray(location.state?.filters?.areas)
      ? location.state?.filters?.areas
      : [location.state?.filters?.areas],
    endTime: location.state?.filters?.endTime,
    startTime: location.state?.filters?.startTime,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [visibleCards, setVisibleCards] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const { data: filterData } = useFetch("data-for-filter");
  console.log(filterData, "filterData");
  useEffect(() => {
    const showFilter = async () => {
      try {
        const response = await dataForFilter("data-for-filter");
        setFilterData(response);
      } catch (error) {
        return error;
      }
      
    };
    showFilter();
  }, []);

  useEffect(() => {
    const fetchFilteredDataAndUpdateState = async () => {
      if (!filterData) return;

      const requestBody = {
        kitchen_ids: filters.kitchen_ids.map((res) => Number(res)) || [],
        facility_ids: filters.facility_ids.map((res) => Number(res)) || [],
        areas_ids: filters.areas_ids.map((res) => Number(res)) || [],
        // menu_type_ids: filters.menu_type_ids || [],
        // person: filters.person || 1,
        startTime: filters.startTime,
        endTime: filters.endTime,
      };

      try {
        setLoading(true);
        const result = await fetchFilteredData(requestBody);
        console.log(result, "result");
        setFilteredData(Array.isArray(result) ? result : [result]);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredDataAndUpdateState();
  }, [filters, filterData]);

  const handleLoadMore = () => setVisibleCards((prev) => prev + 4);
  const hasMore = visibleCards < filteredData.length;

  const updateFilter = (category, id) => {
    setFilters((prev) => {
      const newCategoryIds = prev[category] || [];
      return {
        ...prev,
        [category]: newCategoryIds.includes(id)
          ? newCategoryIds.filter((item) => item !== id)
          : [...newCategoryIds, id],
      };
    });
  };

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error loading data.</p>;

  // Ensure the data is always an array before transformation
  const transformedData = transformSingleImageData(filteredData);

  console.log(transformedData, 'transformedData');
  

  const generateTimeOptionsWithAMPM = () => {
    const options = [];

    const formatTime = (hours, minutes) => {
      const period = hours >= 12 ? "PM" : "AM";
      const adjustedHours = hours % 12 || 12; // Convert 24-hour time to 12-hour time
      const displayTime = `${adjustedHours}:${minutes
        .toString()
        .padStart(2, "0")} ${period}`;
      const valueTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:00`;
      return {
        id: valueTime,
        name: displayTime,
      };
    };

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        options.push(formatTime(hour, minute));
      }
    }

    return options;
  };

  const timeOptions = generateTimeOptionsWithAMPM();

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
              <h3 className="text-2xl font-bold text-tn_dark">Kitchens</h3>
              <Checkbox
                options={filterData?.kitchens || []}
                selectedOptions={filters.kitchen_ids || []}
                onChange={(id) => updateFilter("kitchen_ids", id)}
              />
            </div>
            <div className="block mb-6">
              <h3 className="text-2xl font-bold text-tn_dark">Facilities</h3>
              <Checkbox
                options={filterData?.facilities || []}
                selectedOptions={filters.facility_ids || []}
                onChange={(id) => updateFilter("facility_ids", id)}
              />
            </div>
            <div className="block mb-6">
              <h3 className="text-2xl font-bold text-tn_dark">Areas</h3>
              <Checkbox
                options={filterData?.areas || []}
                selectedOptions={filters.areas_ids || []}
                onChange={(id) => updateFilter("areas_ids", id)}
              />
            </div>
            <div className="block mb-6">
              <h3 className="text-2xl font-bold text-tn_dark">Persons</h3>
              <SelectOption
                options={Array.from({ length: 5 }, (_, i) => ({
                  id: i + 1,
                  name: (i + 1).toString(),
                }))}
                value={filters.person || 1}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, person: e.target.value }))
                }
              />
            </div>
            <div className="block mb-6">
              <h3 className="text-2xl font-bold text-tn_dark">Start Time</h3>
              <SelectOption
                options={timeOptions}
                value={filters.startTime || "05:00:00"}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, startTime: e.target.value }))
                }
              />
            </div>
            <div className="block mb-6">
              <h3 className="text-2xl font-bold text-tn_dark">End Time</h3>
              <SelectOption
                options={timeOptions}
                value={filters.endTime || "10:00:00"}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, endTime: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            {loading ? (
              <Loader />
            ) : (
              <>
                {transformedData.length === 0 ? (
                  <div className="text-start text-gray-500 mt-5">
                    No restaurants available for the selected filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-0">
                    {transformedData.slice(0, visibleCards).map((data) => (
                        <CardCarousel
                        key={data.id}
                        id={data.id}
                        title={data.title}
                        address={data.location}
                        images={data.images}
                        rating={data.rating}
                        type={data.type}
                        timeline={data.timeline}                       
                      />
                    ))}
                  </div>
                )}
                <LoadMore
                  onLoadMore={handleLoadMore}
                  hasMore={hasMore}
                  className={"mt-5"}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Listing;
