import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import {
  Button,
  CardCarousel,
  Gallery,
  MapComponent,
  MenuCard,
  RelatedCard,
  SelectOption,
} from "../component";
import { dates, menus, people, times } from "../utils/localDB";
import { fallback } from "../assets";
import { useForm } from "react-hook-form";

export default function RestuarantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useFetch("filter");
  const [card, setCard] = useState(null);
  const [relatedRestaurants, setRelatedRestaurants] = useState([]);
  const { register, handleSubmit } = useForm();

  
  useEffect(() => {
    if (!data) return;

    const foundCard = data.find((card) => card.id === parseInt(id, 10));

    if (foundCard) {
      setCard(foundCard);

      const foundKitchens = foundCard.kitchens.map((kitchen) => kitchen.name);

      const filteredRestaurants = data.filter(
        (restaurant) =>
          restaurant.id !== parseInt(id, 10) &&
          restaurant.kitchens.some((kitchen) =>
            foundKitchens.includes(kitchen.name)
          )
      );

      const sortedRestaurants = filteredRestaurants.slice(0, 4); // Show only latest 4

      setRelatedRestaurants(sortedRestaurants);
    }
  }, [data, id]);

  if (!card)
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  console.log(card, 'restaurant details');
  const Reservation = (formData) => {
    const { date, time, people } = formData;
    navigate(`/reservation/${id}`, {
      state: { restaurant: card, date, time, people },
    });
  };

  return (
    <>
      <div className="container mx-auto p-4 ">
        <Gallery
          images={card.galleries.map((gallery) => gallery.image)}
          address={card.address}
          name={card.name}
        />
      </div>
      <div className="container mx-auto p-4 mb-14">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-9">
            <h3 className="text-black text-[26px] font-bold mb-6">Details</h3>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <h4 className="text-[17px] font-bold mb-1">About</h4>
                <p className="text-sm pr-5 mb-6">
                  {/* Example placeholder text */}
                  Check out OBLU SELECT Lobigili, where idyllic tropical vistas
                  meet nature-inspired designs. Picture a secluded, adults-only
                  setting with modern accommodations, private pools, and amazing
                  views. Exciting excursions like snorkeling, diving, and
                  fishing are just steps away from the beach access.
                </p>
                <h4 className="text-[17px] font-bold mb-1">Social links</h4>
                <ul>
                  <li>one</li>
                  <li>one</li>
                </ul>
              </div>
              <div className="col-span-12 md:col-span-3">
                <h4 className="text-[17px] font-bold mb-1">Cuisine</h4>
                <p className="mb-6 text-sm">
                  {card?.kitchens.map((name) => name.name).join(", ") ||
                    "No cuisine information available"}
                </p>
                <h4 className="text-[17px] font-bold mb-1">Meals</h4>
                <p className="mb-6 text-sm">Lunch & Dinner</p>
                <h4 className="text-[17px] font-bold mb-1">Contact</h4>
                <p className="mb-6 text-sm">
                  {card?.phone || "No contact information available"}
                </p>
              </div>
              <div className="col-span-12 md:col-span-3">
                <h4 className="text-[17px] font-bold mb-1">Opening Hours</h4>
                <p className="mb-6 text-sm">7:30 AM - 8:30 PM</p>
                <h4 className="text-[17px] font-bold mb-1">Features</h4>
                <p className="mb-6 text-sm">
                  {card?.atmospheres
                    .map((atmosphere) => atmosphere.name)
                    .join(", ") || "No features available"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 mt-4 overflow-hidden">
              <div className="">
                <h4 className="text-[17px] font-bold mb-1">location</h4>
                <div className="w-[800px] h-[250px]">
                  <MapComponent
                    latitude={card?.latitude}
                    longitude={card?.longitude}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 p-1">
            <div className="px-4 pt-6 pb-8 rounded-lg shadow-lg border border-tn_light_grey">
              <h3 className="text-black text-[26px] font-bold mb-3">
                For Resrvation
              </h3>
              <form onSubmit={handleSubmit(Reservation)}>
                <SelectOption
                  label="Select Date"
                  options={dates}
                  className="mb-2 mx-auto"
                  selectClassName="ml-0"
                  style={{border:'1px solid #DDDDDD', padding: '5px', fontSize: '14px', borderRadius: '5px'}}
                  {...register("date", {
                    required: true,
                  })}
                />
                <SelectOption
                  label="Select Time"
                  options={times}
                  className="mb-2 mx-auto"
                  selectClassName="ml-0"
                  style={{border:'1px solid #DDDDDD', padding: '5px', fontSize: '14px', borderRadius: '5px'}}
                  {...register("time", {
                    required: true,
                  })}
                />
                <SelectOption
                  label="Number of People"
                  options={people}
                  className="mb-2 mx-auto"
                  selectClassName="ml-0"
                  style={{border:'1px solid #DDDDDD', padding: '5px', fontSize: '14px', borderRadius: '5px'}}
                  {...register("people", {
                    required: true,
                  })}
                />
                <Button children={'Make Resrvation'} className="w-full mt-4"/>
              </form>
              <p className="text-center text-tn_text_grey text-xs mt-2 mb-4">You won’t be charged yet</p>
              <Button children={'See Restaurant’s Menu'} className="w-full border border-black" bgColor="transparnet" textColor="text-black"/>
            </div>
          </div>
        </div>
      </div>

      
      <div className="border-t-2 border-tn_light_grey" />
      <div className="container mx-auto ">
        <div className="mt-14 mb-8">
          <div className="flex justify-between mb-10 sm:mb-14 flex-col sm:flex-row items-end">
            <div className="text-center sm:text-start">
              <h2 className="text-3xl w-full text-black sm:text-4xl md:text-5xl font-extrabold ">
                Related Restaurants
              </h2>
              <p className="text-lg font-normal text-black py-2 sm:py-0">
                Explore more restaurants with similar cuisine
              </p>
            </div>
            <Button
              children={"View All"}
              bgColor="transparent"
              className="border border-black h-min mt-1 hover:bg-tn_pink hover:text-white hover:border-tn_pink duration-200 sm:inline-block block sm:w-auto w-[90%] m-auto sm:m-0"
              textColor="text-black"
              onClick={() => alert("test")}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedRestaurants.length > 0 ? (
              relatedRestaurants.map((restaurant, index) => (
                <RelatedCard
                  key={index}
                  id={restaurant.id}
                  title={restaurant.name}
                  location={restaurant.address}
                  images={restaurant.images}
                />
              ))
            ) : (
              <p>No related restaurants found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
