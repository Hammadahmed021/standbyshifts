import React, { useEffect, useState } from "react";
import { SelectOption, Button } from "./index";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const Filter = () => {
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
  };

  const handleSearch = () => {
    const filterParams = {
      kitchen_ids: selectedOptions.kitchens.map((k) => k.id),
      facility_ids: selectedOptions.facilities.map((f) => f.id),
      menu_type_ids: selectedOptions.menuTypes.map((m) => m.id),
      person: selectedOptions.person,
      startTime: selectedOptions.startTime,
      endTime: selectedOptions.endTime,
    };
    navigate("/listing", { state: { filters: filterParams } });
    console.log(filterParams,' filters comp');
  };

  if (loading) return <p>Loading...</p>;

  const personOptions = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: (i + 1).toString(),
  }));

  const timeOptions = [
    { id: "05:00:00", name: "06:00 PM" },
    { id: "06:00:00", name: "07:00 PM" },
    { id: "07:00:00", name: "08:00 PM" },
    { id: "08:00:00", name: "09:00 PM" },
    { id: "09:00:00", name: "10:00 PM" },
  ];

  return (
    <div className="flex">
      <div className="flex items-center border rounded-lg p-2">
        <SelectOption
          label="Kitchens"
          value={selectedOptions.kitchens}
          onChange={(e) => handleFilterChange(e, "kitchens")}
          options={data?.kitchens || []}
        />

        <SelectOption
          label="Facilities"
          value={selectedOptions.facilities}
          onChange={(e) => handleFilterChange(e, "facilities")}
          options={data?.facilities || []}
        />
        <SelectOption
          label="Areas"
          value={selectedOptions.areas}
          onChange={(e) => handleFilterChange(e, "areas")}
          options={data?.areas || []}
        />

        <SelectOption
          label="Persons"
          value={selectedOptions.person}
          onChange={(e) => handleFilterChange(e, "person")}
          options={personOptions}
        />
        <SelectOption
          label="Start Time"
          value={selectedOptions.startTime}
          onChange={(e) => handleFilterChange(e, "startTime")}
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
