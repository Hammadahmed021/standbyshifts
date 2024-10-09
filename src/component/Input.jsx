import React, { forwardRef, useId, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const Input = forwardRef(function Input(
  {
    icon,
    label,
    iconSize = 15, // Default size for the icon
    iconColor = "#F59200", // Default color for the icon
    type = "text",
    placeholder = "type here...",
    className = "",
    mainInput = '',
    onChange, // Add onChange prop
    ...props
  },
  ref
) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  // Custom styles for placeholder
  const placeholderStyles = {
    color: 'text-tn_light_grey',
    fontSize: 'text-xs',
  };

  return (
    <div className={`w-full relative ${mainInput}`}>
      {icon && (
        <span className="inline-block absolute top-1/3 px-1 left-[6px]" >
            {React.createElement(icon, { size: iconSize, color: iconColor })}
        </span>
      )}
      <input
        type={type === "password" && showPassword ? "text" : type}
        className={`pl-8 appearance-none w-full px-3 py-3 border normal-case border-tn_light_grey outline-none focus:bg-white focus:active:bg-white bg-white text-black rounded-md duration-200 ${className}`}
        ref={ref}
        placeholder={placeholder}
        
        onChange={onChange} // Attach onChange prop
        {...props}
        id={id}
        style={placeholderStyles} // Apply placeholder styles
      />
      {type === "password" && (
        <button
          type="button"
          className="absolute right-3 top-4"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  );
});

export default Input;
