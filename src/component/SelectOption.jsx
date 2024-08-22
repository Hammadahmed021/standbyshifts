import React, { forwardRef, useId } from "react";

const SelectOption = forwardRef(function Input(
  { label, options, className = "",selectClassName = '', ...props },
  ref
) {
  const id = useId();
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="text-sm font-semibold" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        {...props}
        className={`-ml-1 w-full duration-200 focus:none outline-none text-tn_text_grey text-lg font-medium ${selectClassName}`}
      >
        {options?.map(({ id, name, index }) => (
          <option key={index} value={id}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
});

export default SelectOption;