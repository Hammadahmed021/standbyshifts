import React from "react";

export default function Thankyou() {
  // const restaurantName = localStorage.getItem("lastBookingRestaurant");
  // console.log(restaurantName, 'restaurantName');
  let restaurantName = "test"
  
  return (
    <>
      <div className="container mx-auto">
        <div className="bg-tybanner w-full h-40 sm:h-56 my-8"></div>
      </div>
      <div className="container mx-auto text-center mb-8">
        <h4 className="text-sm text-tn_dark">Congratulations</h4>
        <h2 className="text-4xl font-extrabold mb-6">
          Thank you for your resrvation
        </h2>
        <h5 className="text-sm text-tn_dark">Dear Valued Guest,</h5>
        <p className="text-sm text-tn_dark">
          Thank you for choosing {restaurantName} for your dining experience.
          We are delighted to have received your reservation and look forward to
          welcoming you soon! At {restaurantName}, we take pride in providing
          our guests with exceptional cuisine, a warm atmosphere, and
          outstanding service. Your reservation is important to us, and we are
          committed to making your visit a memorable one.
        </p>
      </div>
    </>
  );
}
