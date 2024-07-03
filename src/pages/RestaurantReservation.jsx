import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { menus } from "../utils/localDB";
import { Button, Input, MenuCard } from "../component";
import { FaCheck } from "react-icons/fa";
import { Logo, fallback } from "../assets";

export default function RestaurantReservation() {
  const [selectedMenus, setSelectedMenus] = useState(() => {
    const savedMenus = localStorage.getItem("selectedMenus");
    return savedMenus ? JSON.parse(savedMenus) : {};
  });
  const location = useLocation();
  const { restaurant, date, time, people } = location.state || {};
  const SERVICE_CHARGE = 150;

  useEffect(() => {
    localStorage.setItem("selectedMenus", JSON.stringify(selectedMenus));
  }, [selectedMenus]);

  if (!restaurant || !date || !time || !people) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  const handleCheckboxChange = (menu) => {
    setSelectedMenus((prevSelectedMenus) => {
      const isSelected = prevSelectedMenus.hasOwnProperty(menu.id);

      if (isSelected) {
        const { [menu.id]: removedItem, ...rest } = prevSelectedMenus;
        return rest;
      } else {
        return { ...prevSelectedMenus, [menu.id]: { ...menu, quantity: 1 } };
      }
    });
  };

  const handleQuantityChange = (menuId, increment) => {
    setSelectedMenus((prevState) => {
      const updatedMenu = { ...prevState[menuId] };
      updatedMenu.quantity += increment;
      if (updatedMenu.quantity < 1) {
        updatedMenu.quantity = 1;
      }
      return { ...prevState, [menuId]: updatedMenu };
    });
  };

  const removeMenu = (menuId) => {
    setSelectedMenus((prevState) => {
      const { [menuId]: removedItem, ...rest } = prevState;
      return rest;
    });
  };

  const calculateTotalPrice = () => {
    return Object.values(selectedMenus).reduce(
      (total, menu) => total + menu.price * menu.quantity,
      0
    );
  };

  const totalPrice = calculateTotalPrice();
  const handlePayment = () => {
    if (totalPrice > 0) {
      console.log(totalPrice + SERVICE_CHARGE);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-wrap items-start justify-between mb-8 sm:mb-6 pt-8 sm:pt-10">
        <div>
          <p className="text-tn_dark text-base font-semibold capitalize">
            {restaurant.name}
          </p>
          <h2 className="text-3xl font-extrabold capitalize">
            Restaurant Reservation
          </h2>
        </div>
      </div>
      <div className="container mx-auto p-0 mb-8">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8">
            <h4 className="font-bold text-xl mb-4">Select Menu</h4>
            {menus.map((menu) => (
              <div key={menu.id} className="flex items-center my-2">
                <MenuCard
                  image={menu.image || "fallback_image_url"}
                  fallbackText={"Image not available"}
                  name={menu.name || "No Title"}
                  detail={menu.detail || "No Description"}
                  duration={menu.duration || "N/A"}
                  price={menu.price || "N/A"}
                  type={menu.type || "No Type"}
                />
                <div className="relative ml-12 h-7 w-7">
                  <input
                    type="checkbox"
                    className="appearance-none h-7 w-7 border-4 border-tn_dark rounded-md checked:bg-tn_dark checked:border-transparent focus:ring-tn_dark"
                    checked={selectedMenus.hasOwnProperty(menu.id)}
                    onChange={() => handleCheckboxChange(menu)}
                  />
                  {selectedMenus.hasOwnProperty(menu.id) && (
                    <span className="absolute left-0 top-0 m-[1px] z-10 w-[26px] h-[26px] rounded-md text-tn_light border-2 border-white">
                      <FaCheck
                        size={16}
                        className="mx-auto absolute left-[3px] top-[3px]"
                      />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="relative border border-tn_light_grey rounded-md shadow-md p-4 overflow-hidden">
              <div className="flex items-start border-b border-b-tn_light_grey pb-6">
                <div className="size-16">
                  <img
                    src={
                      restaurant?.profile_image ||
                      restaurant?.galleries[0].image ||
                      fallback
                    }
                    alt={restaurant?.name}
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>

                <div className="ml-3">
                  <p className="text-sm text-tn_text_grey opacity-70 capitalize">
                    {restaurant?.type}
                  </p>
                  <h4 className="font-bold text-xl capitalize">
                    {restaurant?.name}
                  </h4>
                </div>
              </div>
              <div className="border-b border-b-tn_light_grey py-4">
                <p className="inline-flex items-center m-0">
                  Your booking is protected by
                  <img src={Logo} className="w-[100px] ml-2" alt="" />
                </p>
              </div>
              <div className="border-b border-b-tn_light_grey py-4">
                <h4 className="font-bold text-xl capitalize mb-4">Details</h4>
                <p className="text-sm mb-2 flex justify-between items-center text-tn_dark_field">
                  <span className="underline">Date:</span> <span>{date}</span>
                </p>
                <p className="text-sm mb-2 flex justify-between items-center text-tn_dark_field">
                  <span className="underline">Time:</span> <span>{time}</span>
                </p>
                <p className="text-sm mb-2 flex justify-between items-center text-tn_dark_field">
                  <span className="underline">Number of People:</span>{" "}
                  <span>{people}</span>
                </p>
                <p className="text-sm mb-2 flex justify-between items-center text-tn_dark_field">
                  <span className="underline">Service Charge:</span>
                  <span>${SERVICE_CHARGE}</span>
                </p>
              </div>
              <div className="border-b border-b-tn_light_grey py-4">
                <h4 className="font-bold text-xl capitalize mb-4">Dishes</h4>
                <ul>
                  {Object.keys(selectedMenus).length > 0 ? (
                    Object.values(selectedMenus).map((menu) => (
                      <li key={menu.id} className="mb-3">
                        <div className="relative flex justify-between items-center">
                          <div className="flex space-x-1 w-4/5 items-center">
                            <div className="size-16 w-1/4">
                              <img
                                src={menu?.image || "fallback_image_url"}
                                alt={restaurant?.name}
                                className="object-cover size-16 rounded-md "
                              />
                            </div>
                            <div className="flex flex-col justify-between relative w-3/4">
                              <span className="text-xs text-tn_text_grey opacity-70">
                                {menu.type}
                              </span>
                              <span className="text-lg font-bold ">
                                {menu.name}
                              </span>
                              <span className="text-xs text-tn_dark_field font-medium">
                                DKK {menu.price * menu.quantity}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 w-1/5">
                            <div className="flex items-center p-1 border border-black rounded-2xl text-sm">
                              <button
                                onClick={() =>
                                  handleQuantityChange(menu.id, -1)
                                }
                                style={{ margin: "0 5px" }}
                              >
                                -
                              </button>
                              <span>{menu.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(menu.id, 1)}
                                style={{ margin: "0 5px" }}
                              >
                                +
                              </button>
                            </div>
                            <span
                              onClick={() => removeMenu(menu.id)}
                              className="cursor-pointer text-white px-1 shadow-sm bg-red-600 rounded-sm ml-2 text-xs"
                            >
                              X
                            </span>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-tn_dark_field">Card is empty. Select menu item first!</p>
                  )}
                </ul>
              </div>
              <p className="text-base text-tn_dark_field font-semibold flex justify-between items-center mt-4">
                <span>Total (DKK)</span>
                <span>DKK {`${calculateTotalPrice() + SERVICE_CHARGE}`}</span>
              </p>
            </div>
            <div className="mt-6 mb-4">
              <Input
                type="text"
                placeholder="Enter Your Name"
                className="border-tn_light_grey mb-4"
              />
              <Input
                type="tel"
                placeholder="Enter Your Phone"
                className="border-tn_light_grey mb-5"
              />

              <h4 className="font-bold text-xl capitalize mb-4">
                Terms & Conditions
              </h4>
              <p className="text-sm mb-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate.
              </p>
              <p className="text-sm mb-8">
                velit esse cillum dolore Dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                aute irure dolor in reprehenderit in voluptate velit esse cillum
                dolore utemien.
              </p>
              <Button
                children={"Confirm Payment"}
                className={`w-full ${
                  totalPrice === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handlePayment}
                disabled={totalPrice === 0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
