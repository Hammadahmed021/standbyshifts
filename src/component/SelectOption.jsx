import React, { forwardRef, useId } from "react";

const SelectOption = forwardRef(function Input(
  {
    icon,
    iconSize = 15, // Default size for the icon
    iconColor = "#F59200", // Default color for the icon,
    label,
    options,
    className = "",
    pl = "pl-8",
    ...props
  },
  ref
) {
  const id = useId();
  // console.log(options, 'options');

  return (
    <div className={`w-full ${className} bg-transparent  relative`}>
      {icon && (
        <span className="inline-block absolute top-1/3 px-1 left-[6px]">
          {React.createElement(icon, { size: iconSize, color: iconColor })}
        </span>
      )}
      {label && (
        <label className="text-sm font-semibold" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        {...props}
        className={`-ml-1 w-full duration-200 focus:none outline-none text-tn_text_grey text-base font-normal bg-transparent ${pl}`}
      >
        {options?.map(({ id, name, index, title }) => (
          <option key={index} value={id}>
            {name ?? title}
          </option>
        ))}
      </select>
    </div>
  );
});

export default SelectOption;
