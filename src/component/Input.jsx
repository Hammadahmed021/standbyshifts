import React, { forwardRef, useId, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const Input = forwardRef(function Input(
  {
    label,
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
    textTransform: 'capitalize'
  };

  return (
    <div className={`w-full relative ${mainInput}`}>
      {label && (
        <label className="inline-block mb-1 pl-1 absolute -top-2 px-1 left-4 text-xs text-tn_dark_field bg-white" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type={type === "password" && showPassword ? "text" : type}
        className={`appearance-none w-full px-3 py-3 border border-tn_dark_field outline-none focus:bg-white focus:active:bg-white bg-white text-black rounded-md duration-200 ${className}`}
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
