import React, { useState, useEffect } from "react";
import { SelectOption, Button, Loader } from "./index";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { dataForFilter } from "../utils/Api";

const Filter = ({ onFilterChange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    kitchens: [], // Default to first kitchen
    // atmospheres: [],
    facilities: [],
    areas: [],
    // menuTypes: [],
    person: [],
    startTime: "00:00:00",
    endTime: "01:00:00",
  });

  const navigate = useNavigate();
  // const { data, loading } = useFetch("data-for-filter");
  useEffect(() => {
    const showFilter = async () => {
      setLoading(true)
      try {
        const response = await dataForFilter("data-for-filter");
        setData(response);
      } catch (error) {
        return error;
      }
      finally{
      setLoading(false)

      }
    };
    showFilter();
  }, []);


  useEffect(() => {
    if (data) {
      setSelectedOptions((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        kitchens:
          prevSelectedOptions.kitchens.length > 0
            ? prevSelectedOptions.kitchens
            : [data.kitchens?.[0]?.id],
        facilities:
          prevSelectedOptions.facilities.length > 0
            ? prevSelectedOptions.facilities
            : [data.facilities?.[0]?.id],
        areas:
          prevSelectedOptions.areas.length > 0
            ? prevSelectedOptions.areas
            : [data.areas?.[0]?.id],
      }));
    }
  }, [data]);

  const handleFilterChange = (e, category) => {
    const value = Array.isArray(e.target.value)
      ? e.target.value
      : [e.target.value]; // Ensure it's an array
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [category]: value,
    }));
    onFilterChange({
      ...selectedOptions,
      [category]: value,
    });
  };

  const handleTimeChange = (e, isStartTime) => {
    const value = e.target.value;
    let newEndTime = selectedOptions.endTime;

    if (isStartTime) {
      const [hours, minutes] = value.split(":").map(Number);
      const newHours = (hours + 1) % 24;
      newEndTime = `${newHours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:00`;

      setSelectedOptions((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        startTime: value,
        endTime: newEndTime,
      }));
    } else {
      setSelectedOptions((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        endTime: value,
      }));
    }
  };

  const handleSearch = () => {
    navigate("/listing", { state: { filters: selectedOptions } });
  };

  if (loading)
    return (
      <p>
        <Loader />
      </p>
    );

  const personOptions = [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
    { id: 4, name: "4" },
    { id: 5, name: "5" },
    { id: 6, name: "6" },
    { id: 7, name: "7" },
    { id: 8, name: "8" },
  ];

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
      for (let minute = 0; minute < 60; minute += 15) {
        options.push(formatTime(hour, minute));
      }
    }

    return options;
  };

  const timeOptions = generateTimeOptionsWithAMPM();

  return (
    <div className="flex">
      <div className="flex items-center border rounded-lg p-2">
        <SelectOption
          label="All Kitchens"
          value={selectedOptions.kitchens}
          onChange={(e) => handleFilterChange(e, "kitchens")}
          className="border-r-2 pr-1 mx-5"
          options={data?.kitchens || []}
        />
        <SelectOption
          label="All Areas"
          value={selectedOptions.areas}
          onChange={(e) => handleFilterChange(e, "areas")}
          className="border-r-2 pr-1 mx-5"
          options={data?.areas || []}
        />
        <SelectOption
          label="All Facilities"
          value={selectedOptions.facilities}
          onChange={(e) => handleFilterChange(e, "facilities")}
          className="border-r-2 pr-1 mx-5"
          options={data?.facilities || []}
        />
        <SelectOption
          label="Persons"
          value={selectedOptions.person}
          onChange={(e) => handleFilterChange(e, "person")}
          className="border-r-2 pr-1 mx-5"
          options={personOptions}
        />
        <SelectOption
          label="Start Time"
          value={selectedOptions.startTime}
          onChange={(e) => handleTimeChange(e, true)}
          className="border-r-2 pr-1 mx-5"
          options={timeOptions}
        />
        <SelectOption
          label="End Time"
          value={selectedOptions.endTime}
          onChange={(e) => handleTimeChange(e, false)}
          options={timeOptions}
        />
      </div>
      <Button onClick={handleSearch} className="ml-2 px-8 text-xl">
        Search
      </Button>
    </div>
  );
};

export default Filter;
