import React, { useState } from "react";
import { BsBackpack, BsBackpack2 } from "react-icons/bs";
import { FaShoppingBag } from "react-icons/fa";
import { FaBagShopping, FaCartFlatbed } from "react-icons/fa6";
import { LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Search = ({ data, className ,onSearch}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Function to handle search input change
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    const filteredSuggestions = data.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  // Function to navigate to the selected card
  const navigateToCard = (id) => {
    navigate(`/restaurant/${id}`); // Navigate to restaurant detail page
    setSearchTerm(""); // Clear search input after navigation
    setSuggestions([]); // Clear suggestions after navigation
  };

  return (
    <>
      <span
        className={`py-2 w-auto border outline-none focus:bg-gray-50 bg-white text-black rounded-site text-sm duration-200 border-gray-200 flex justify-between shadow-lg ${className}`}
      >
        <span className="flex items-center">
          <BsBackpack size={18} className="mx-3"/>
          <input
            type="text"
            placeholder={"Job title or keywords"}
            className={` w-full outline-none`}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </span>
        <LuSearch
          size={24}
          className="bg-tn_primary mr-2 rounded-full w-8 h-8 py-1 px-2 text-white"
          onClick={() =>onSearch(searchTerm) ?? handleSearch(searchTerm)}
        />
      </span>
      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-12 mt-1 bg-white border border-gray-300 shadow-md rounded-lg z-10">
          {suggestions.map((item) => (
            <div
              key={item.id}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => navigateToCard(item.id)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Search;
