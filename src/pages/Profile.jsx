import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearBookingById, clearAllBookings } from "../store/bookingSlice";
import { fallback } from "../assets";
import { useNavigate, useParams, Link } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const bookings = useSelector((state) =>
    state.bookings.filter((booking) => booking.user === userData?.uid)
  );

  const handleClearBooking = (bookingId) => {
    dispatch(clearBookingById(bookingId));
  };

  const handleClearAllBookings = () => {
    dispatch(clearAllBookings());
  };

  // const handleRebook = (restaurantId, selectedMenus) => {
  //   navigate(`/reservation/${restaurantId}`, { state: { selectedMenus } });
  // };

  return (
    <>
      <div className="container mx-auto p-4">
        <img
          src={userData?.photoURL || fallback}
          alt="user profile"
          className="w-16 h-16 rounded-full"
        />
        <p className="text-3xl font-extrabold text-tn_dark mt-4">
          Welcome {userData?.displayName}
        </p>
        <p className="mt-1 text-base text-tn_dark mb-0">{userData?.email}</p>
      </div>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold mb-4">Your Booking History</h1>
        <button
          onClick={handleClearAllBookings}
          className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
        >
          Clear All Bookings
        </button>
        {bookings?.length === 0 ? (
          <p className="text-lg text-tn_dark">No bookings to display.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="border rounded-md p-4 mb-4">
              <p>
                <strong>Restaurant:</strong> {booking.restaurant.name}
              </p>
              <p>
                <strong>Date:</strong> {booking.date}
              </p>
              <p>
                <strong>Time:</strong> {booking.time}
              </p>
              <p>
                <strong>People:</strong> {booking.people}
              </p>
              <p>
                <strong>Total Price:</strong> ${booking.totalPrice}
              </p>
              <div className="flex">
                <Link
                  to={{
                    pathname: `/restaurant/${booking.restaurant.id}`,
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-md inline-block mt-2"
                >
                  Rebook
                </Link>
                <button
                  onClick={() => handleClearBooking(booking.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Clear Booking
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Profile;
