import React, { forwardRef, useId } from "react";

const SelectOption = forwardRef(function Input(
  { label, options, className = "",selectClassName = '', ...props },
  ref
) {
  const id = useId();
  // console.log(options, 'options');
  
  return (
    <div className={`w-full ${className} bg-transparent`}>
      {label && (
        <label className="text-sm font-semibold" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        {...props}
        className={`-ml-1 w-full duration-200 focus:none outline-none text-tn_text_grey text-lg font-medium bg-transparent ${selectClassName}`}
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