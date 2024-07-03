import React from "react";
import { FaCheck } from "react-icons/fa";

const Checkbox = ({ label, options, selectedOptions, onChange }) => (
  <div className="my-4">
    <p className="text-sm font-semibold">{label}</p>
    {options.map((option) => (
      <label key={option.id} className="flex items-center my-2">
        <div className="relative">
          <input
            type="checkbox"
            value={option.id}
            checked={selectedOptions.includes(option.id)}
            onChange={() => onChange(option.id)}
            className="appearance-none h-4 w-4 border border-tn_light_grey rounded-sm checked:bg-tn_dark checked:border-transparent focus:ring-tn_dark"
          />
          {selectedOptions.includes(option.id) && (
            <span className="absolute left-[2px] top-1 z-10 text-tn_light">
              <FaCheck size={12}/>
            </span>
          )}
        </div>

        <span className="ml-2">{option.name}</span>
      </label>
    ))}
  </div>
);

export default Checkbox;
