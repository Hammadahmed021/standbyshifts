import React, { useState, useEffect } from 'react';

const Autocomplete = ({ options, onAddTag }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    if (inputValue) {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  }, [inputValue, options]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      const trimmedValue = inputValue.trim();
      if (trimmedValue && !filteredOptions.includes(trimmedValue)) {
        onAddTag(trimmedValue); // Add new tag
      }
      setInputValue(''); // Clear input
      setFilteredOptions([]); // Clear filtered options
    }
  };

  const handleOptionClick = (option) => {
    onAddTag(option); // Add selected option as tag
    setInputValue(''); // Clear input
    setFilteredOptions([]); // Clear filtered options
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="border p-2 w-full"
        placeholder="Add a tag..."
      />
      {filteredOptions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 w-full z-10">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
