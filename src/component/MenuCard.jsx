import React, { useState } from 'react';

const MenuCard  = ({ image, fallbackText, name, detail, duration, price, type }) => {
    const [imgError, setImgError] = useState(false);
  
    const handleError = () => {
      setImgError(true);
    };
  
    return (
        <div className="max-w-xl w-full sm:w-[100%] overflow-hidden rounded-xl flex mb-6 bg-tn_light">
        <div className="w-1/2">
          {!imgError ? (
            <img
              className="w-full h-full object-cover"
              src={image}
              alt={name}
              onError={handleError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-l-lg">
              <span className="text-tn_text_grey">{fallbackText}</span>
            </div>
          )}
        </div>
        <div className="w-1/2 px-6 py-4 flex flex-col justify-between">
          <p className="font-medium text-md mb-2">{type}</p>
          <div>
          <h4 className="font-bold text-xl mb-2 ellipsis">{name}</h4>
          <p className="text-sm text-tn_text_grey opacity-70">{detail}</p>
          </div>
          
          <div className="flex justify-between items-center">
          <p className=" text-sm">{duration}</p>
          <p className=" text-lg font-bold">Dkk   {price}</p>
          </div>
          
        </div>
      </div>
    );
  };

export default MenuCard;
