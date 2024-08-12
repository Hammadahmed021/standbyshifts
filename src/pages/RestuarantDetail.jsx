import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useForm } from "react-hook-form";
import {
  Button,
  CardCarousel,
  Gallery,
  Loader,
  MapComponent,
  SelectOption,
} from "../component";
import { fallback } from "../assets";

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useFetch("hotels");
  const [card, setCard] = useState(null);
  const [relatedRestaurants, setRelatedRestaurants] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const { register, handleSubmit, watch, resetField, setValue } = useForm();

  const selectedDate = watch("date");
  const selectedTime = watch("time");
  const selectedSeats = watch("seats");

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!data) return;

    const foundCard = data.find((card) => card.id === parseInt(id, 10));

    if (foundCard) {
      setCard(foundCard);

      const foundKitchens =
        foundCard.kitchens?.map((kitchen) => kitchen.name) || [];
      const filteredRestaurants = data.filter(
        (restaurant) =>
          restaurant.id !== parseInt(id, 10) &&
          restaurant.kitchens?.some((kitchen) =>
            foundKitchens.includes(kitchen.name)
          )
      );
      setRelatedRestaurants(filteredRestaurants.slice(0, 4));
    } else {
      setCard(null);
    }
  }, [data, id]);

  useEffect(() => {
    if (selectedDate && card?.calendars) {
      const dateCalendar = card.calendars.find(
        (calendar) => calendar.date === selectedDate
      );

      if (dateCalendar) {
        const times = dateCalendar.calendar_details.map((detail) => ({
          name: detail.time,
          id: detail.time,
        }));

        setAvailableTimes(times || []);
        resetField("time");
        resetField("seats");
        setAvailableSeats([]);

        if (times.length > 0) {
          setValue("time", times[0].id); // Automatically select first available time
        }
      } else {
        setAvailableTimes([]);
      }
    }
  }, [selectedDate, card, resetField, setValue]);

  useEffect(() => {
    if (selectedTime && selectedDate && card?.calendars) {
      const dateCalendar = card.calendars.find(
        (calendar) => calendar.date === selectedDate
      );

      if (dateCalendar) {
        const timeDetail = dateCalendar.calendar_details.find(
          (detail) => detail.time === selectedTime
        );
        if (timeDetail) {
          const seats = Array.from(
            { length: timeDetail.seats },
            (_, index) => index + 1
          ).map((seat) => ({
            name: seat,
            label: seat,
            id: seat,
          }));

          setAvailableSeats(seats);

          if (seats.length > 0) {
            setValue("seats", seats[0].id); // Automatically select first available seats
          }
        } else {
          setAvailableSeats([]);
        }
      }
    }
  }, [selectedTime, selectedDate, card, setValue]);

  useEffect(() => {
    if (card?.calendars && card.calendars.length > 0) {
      const firstDate = card.calendars.find(
        (calendar) => new Date(calendar.date) >= new Date(today)
      );
      if (firstDate) {
        setValue("date", firstDate.date); // Automatically select first available date
      }
    }
  }, [card, setValue, today]);

  const onSubmit = (formData) => {
    const { date, time, seats } = formData;
    navigate(`/reservation/${id}`, {
      state: { hotel_id: card.id, restaurant: card, date, time, seats },
    });
  };

  if (loading)
    return <div className="container mx-auto p-4 text-center"><Loader /></div>;
  if (error)
    return <div className="container mx-auto p-4 text-center">{error}</div>;
  if (!card)
    return (
      <div className="container mx-auto p-4 text-center">
        Restaurant not found.
      </div>
    );

  const futureDates = card.calendars.filter(
    (calendar) => new Date(calendar.date) >= new Date(today)
  );

  function extractFacilitiesNames(card) {
    const facilityNames = new Set();

    // Extract from calendars -> calendar_details
    card.calendars?.forEach((calendar) => {
      calendar.menus?.forEach((menu) => {
        menu.facilities?.forEach((facility) => {
          if (facility.name) facilityNames.add(facility.name);
        });
      });
    });
    return Array.from(facilityNames); // Convert Set to Array
  }

  function extractCuisineNames(card) {
    const facilityNames = new Set();

    // Extract from calendars -> calendar_details
    card.calendars?.forEach((calendar) => {
      calendar.menus?.forEach((menu) => {
        menu.kitchens?.forEach((facility) => {
          if (facility.name) facilityNames.add(facility.name);
        });
      });
    });
    return Array.from(facilityNames); // Convert Set to Array
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <Gallery
          images={card.galleries?.map((gallery) => gallery.image) || [fallback]}
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
                  {card.description || "No description available."}
                </p>
                <h4 className="text-[17px] font-bold mb-1">Social links</h4>
                <ul>
                  {card.socialLinks?.map((link, index) => (
                    <li key={index}>{link}</li>
                  )) || <li>No social links available.</li>}
                </ul>
              </div>
              <div className="col-span-12 md:col-span-3">
                <h4 className="text-[17px] font-bold mb-1">Cuisine</h4>
                <p className="mb-6 text-sm">
                {extractCuisineNames(card).join(", ") ||
                    "No cuisine available"}
                </p>
                <h4 className="text-[17px] font-bold mb-1">Meals</h4>
                <p className="mb-6 text-sm">
                  {card.meals || "No meal information available."}
                </p>
                <h4 className="text-[17px] font-bold mb-1">Contact</h4>
                <p className="mb-6 text-sm">
                  {card.phone || "No contact information available"}
                </p>
              </div>
              <div className="col-span-12 md:col-span-3">
                <h4 className="text-[17px] font-bold mb-1">Opening Hours</h4>
                <p className="mb-6 text-sm">
                  {card.openingHours || "No opening hours available."}
                </p>
                <h4 className="text-[17px] font-bold mb-1">Features</h4>
                <p className="mb-6 text-sm">
                  {extractFacilitiesNames(card).join(", ") ||
                    "No facilities available"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 mt-4 overflow-hidden">
              <div className="">
                <h4 className="text-[17px] font-bold mb-1">Location</h4>
                <div className="w-[800px] h-[250px]">
                  <MapComponent
                    latitude={card.latitude}
                    longitude={card.longitude}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 p-1">
            <div className="px-4 pt-6 pb-8 rounded-lg shadow-lg border border-tn_light_grey">
              <h3 className="text-black text-[26px] font-bold mb-3">
                For Reservation
              </h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                {futureDates.length > 0 ? (
                  <>
                    <SelectOption
                      label="Date"
                      className="mb-6 mx-auto"
                      options={
                        futureDates.map((calendar) => ({
                          name: calendar.date,
                          id: calendar.date,
                        })) || []
                      }
                      {...register("date", { required: true })}
                      style={{
                        border: "1px solid #DDDDDD",
                        padding: "5px",
                        fontSize: "14px",
                        borderRadius: "5px",
                      }}
                    />
                    {availableTimes.length > 0 ? (
                      <>
                        <SelectOption
                          label="Time"
                          className="mb-6 mx-auto"
                          options={availableTimes || []}
                          {...register("time", { required: true })}
                          style={{
                            border: "1px solid #DDDDDD",
                            padding: "5px",
                            fontSize: "14px",
                            borderRadius: "5px",
                          }}
                        />
                        {availableSeats.length > 0 ? (
                          <SelectOption
                            label="Seats"
                            className="mb-6 mx-auto"
                            options={availableSeats || []}
                            {...register("seats", { required: true })}
                            style={{
                              border: "1px solid #DDDDDD",
                              padding: "5px",
                              fontSize: "14px",
                              borderRadius: "5px",
                            }}
                          />
                        ) : (
                          <p className="text-sm text-red-600">
                            No seats available for the selected time.
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-red-600">
                        No times available for the selected date.
                      </p>
                    )}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        !selectedDate || !selectedTime || !selectedSeats
                      }
                    >
                      Make a Reservation
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-red-600">No dates available.</p>
                )}
              </form>
              {/* <p className="text-center text-tn_text_grey text-xs mt-2 mb-4">
                You won’t be charged yet
              </p>
              <Button
                children={"See Restaurant’s Menu"}
                className="w-full border border-black"
                bgColor="transparnet"
                textColor="text-black"
              /> */}
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
