import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa'; // Import the remove icon

const Autocomplete = ({ options, onAddTag, selectedTags, onRemoveTag }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    if (inputValue) {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.includes(option) // Exclude already selected tags
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
    setSelectedIndex(-1);
  }, [inputValue, options, selectedTags]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      const optionToAdd = selectedIndex >= 0 ? filteredOptions[selectedIndex] : inputValue.trim();
      if (optionToAdd && !selectedTags.includes(optionToAdd)) {
        onAddTag(optionToAdd);
      }
      setInputValue('');
      setFilteredOptions([]);
      setSelectedIndex(-1);
    } else if (event.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, filteredOptions.length - 1));
    } else if (event.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  const handleOptionClick = (option) => {
    if (!selectedTags.includes(option)) {
      onAddTag(option);
    }
    setInputValue('');
    setFilteredOptions([]);
  };

  return (
    <div className="relative">
      {/* Input Field */}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="border p-2 w-full"
        placeholder="Add a tag..."
      />

      {/* Dropdown Suggestions */}
      {filteredOptions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 w-full z-10">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`p-2 cursor-pointer ${
                index === selectedIndex ? 'bg-gray-200' : 'hover:bg-gray-200'
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}

      {/* Selected Tags with Remove Button */}
      {selectedTags.length > 0 && (
        <ul className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map((tag, index) => (
            <li
              key={index}
              className="flex items-center px-2 py-1 bg-blue-500 text-white rounded-full text-sm"
            >
              {tag}
              <FaTimes
                size={12}
                onClick={() => onRemoveTag(tag)}
                className="ml-2 cursor-pointer hover:text-red-400"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
