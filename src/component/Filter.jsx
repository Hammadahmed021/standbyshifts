import React, { useState, useEffect } from "react";
import { SelectOption, Button } from "./index";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const Filter = ({ onFilterChange }) => {
  const [selectedOptions, setSelectedOptions] = useState({
    kitchens: [],
    atmospheres: [],
    facilities: [],
    areas: [],
    menuTypes: [],
    person: 1,
    startTime: "05:00:00",
    endTime: "10:00:00",
  });

  const navigate = useNavigate();
  const { data, loading } = useFetch("data-for-filter");

  useEffect(() => {
    if (data) {
      setSelectedOptions((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        kitchens: data.kitchens || [],
        atmospheres: data.atmospheres || [],
        facilities: data.facilities || [],
        areas: data.areas || [],
        menuTypes: data.menuTypes || [],
      }));
    }
  }, [data]);

  const handleFilterChange = (e, category) => {
    const value = e.target.value;
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [category]: value,
    }));
    onFilterChange({
      ...selectedOptions,
      [category]: value,
    });
  };

  const handleSearch = () => {
    navigate("/listing", { state: { filters: selectedOptions } });
    console.log(selectedOptions, 'filter options');
  };
  
  if (loading) return <p>Loading...</p>;

  const personOptions = [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
    { id: 4, name: "4" },
    { id: 5, name: "5" },
  ];

  const timeOptions = [
    { id: "05:00:00", name: "05:00 PM" },
    { id: "06:00:00", name: "06:00 PM" },
    { id: "07:00:00", name: "07:00 PM" },
    { id: "08:00:00", name: "08:00 PM" },
    { id: "09:00:00", name: "09:00 PM" },
    { id: "10:00:00", name: "10:00 PM" },
  ];

  return (
    <div className="flex">
      <div className="flex items-center border rounded-lg p-2">
        <SelectOption
          label="Kitchens"
          value={selectedOptions.kitchens}
          onChange={(e) => handleFilterChange(e, "kitchens")}
          className="border-r-2 pr-1 mx-5"
          options={data?.kitchens || []}
        />
        {/* <SelectOption
          label="Atmospheres"
          value={selectedOptions.atmospheres}
          onChange={(e) => handleFilterChange(e, "atmospheres")}
          className="border-r-2 pr-1 mx-5"
          options={data?.atmospheres || []}
        /> */}
        {/* <SelectOption
          label="Facilities"
          value={selectedOptions.facilities}
          onChange={(e) => handleFilterChange(e, "facilities")}
          className="border-r-2 pr-1 mx-5"
          options={data?.facilities || []}
        /> */}
        <SelectOption
          label="Areas"
          value={selectedOptions.areas}
          onChange={(e) => handleFilterChange(e, "areas")}
          className="border-r-2 pr-1 mx-5"
          options={data?.areas || []}
        />
        <SelectOption
          label="Menu"
          value={selectedOptions.menuTypes}
          onChange={(e) => handleFilterChange(e, "menuTypes")}
          className="border-r-2 pr-1 mx-5"
          options={data?.menuTypes || []}
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
          onChange={(e) => handleFilterChange(e, "startTime")}
          className="border-r-2 pr-1 mx-5"
          options={timeOptions}
        />
        <SelectOption
          label="End Time"
          value={selectedOptions.endTime}
          onChange={(e) => handleFilterChange(e, "endTime")}
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
