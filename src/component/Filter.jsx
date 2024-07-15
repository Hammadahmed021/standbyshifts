import React, { useState, useEffect } from "react";
import { SelectOption, Button } from "../component";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const Filter = ({ onFilterChange }) => {
  const [selectedOptions, setSelectedOptions] = useState({
    kitchens: "",
    atmospheres: "",
    facilities: "",
    areas: "",
    menuTypes: "",
  });

  const navigate = useNavigate();
  const { data, loading } = useFetch("data-for-fitler");

  useEffect(() => {
    if (data) {
      setSelectedOptions((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        kitchens: data.kitchens?.original[0]?.id || "",
        atmospheres: data.atmospheres?.original[0]?.id || "",
        facilities: data.facilities?.original[0]?.id || "",
        areas: data.areas?.original[0]?.id || "",
        menuTypes: data.menuTypes?.original[0]?.id || "",
      }));
    }
  }, [data]);

  const handleFilterChange = (e, category) => {
    const value = e.target.value;

    // Update local state asynchronously
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [category]: value,
    }));

    // Notify parent component (Home) of filter change
    onFilterChange({
      ...selectedOptions,
      [category]: value,
    });
  };

  const handleSearch = () => {
    navigate("/listing", { state: { filters: selectedOptions } });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex">
      <div className="flex items-center border rounded-lg p-2">
        <SelectOption
          label="Kitchens"
          value={selectedOptions.kitchens}
          onChange={(e) => handleFilterChange(e, "kitchens")}
          className="border-r-2 pr-1 mx-5"
          options={data?.kitchens?.original || []}
        />
        <SelectOption
          label="Atmospheres"
          value={selectedOptions.atmospheres}
          onChange={(e) => handleFilterChange(e, "atmospheres")}
          className="border-r-2 pr-1 mx-5"
          options={data?.atmospheres?.original || []}
        />
        <SelectOption
          label="Facilities"
          value={selectedOptions.facilities}
          onChange={(e) => handleFilterChange(e, "facilities")}
          className="border-r-2 pr-1 mx-5"
          options={data?.facilities?.original || []}
        />
        <SelectOption
          label="Areas"
          value={selectedOptions.areas}
          onChange={(e) => handleFilterChange(e, "areas")}
          className="border-r-2 pr-1 mx-5"
          options={data?.areas?.original || []}
        />
        <SelectOption
          label="Menu"
          value={selectedOptions.menuTypes}
          onChange={(e) => handleFilterChange(e, "menuTypes")}
          options={data?.menuTypes?.original || []}
        />
      </div>
      <Button onClick={handleSearch} className="ml-2 px-8 text-xl">
        Search
      </Button>
    </div>
  );
};

export default Filter;
