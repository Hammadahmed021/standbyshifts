import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearBookingById, clearAllBookings } from "../store/bookingSlice";
import { updateUserData } from "../store/authSlice";
import { fallback } from "../assets";
import { useNavigate, useParams, Link } from "react-router-dom";
import { LoadMore } from "../component";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const bookings = useSelector((state) =>
    state.bookings.filter((booking) => booking.user === userData?.uid)
  );
  
  const [displayedBookings, setDisplayedBookings] = useState(4); // Display first 4 bookings
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(userData?.photoURL || fallback);

  const handleClearBooking = (bookingId) => {
    dispatch(clearBookingById(bookingId));
  };

  const handleClearAllBookings = () => {
    dispatch(clearAllBookings());
  };

  const handleLoadMore = () => {
    setDisplayedBookings(displayedBookings + 4); // Load 4 more bookings
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Simulate image upload process
      const updatedUserData = {
        photoURL: imagePreview,
      };
      // Dispatch action to update user data in the Redux store
      dispatch(updateUserData(updatedUserData));
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex items-center">
          <img
            src={imagePreview}
            alt="user profile"
            className="w-16 h-16 rounded-full"
          />
          <div className="ml-4">
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Upload Image
            </button>
          </div>
        </div>
        <p className="text-3xl font-extrabold text-tn_dark mt-4">
          Welcome {userData?.displayName}
        </p>
        <p className="mt-1 text-base text-tn_dark mb-0">{userData?.email}</p>
      </div>
      <div className="container mx-auto p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-extrabold mb-4">
              Your Booking History
            </h2>
            <p>
              Check your past and upcoming reservations easily by viewing your
              reservation history here.
            </p>
          </div>
          <button
            onClick={handleClearAllBookings}
            className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
          >
            Clear All Bookings
          </button>
        </div>

        {bookings.length === 0 ? (
          <p className="text-lg text-tn_dark">No bookings to display.</p>
        ) : (
          bookings.slice(0, displayedBookings).map((booking) => (
            <div key={booking.id} className="border rounded-md p-4 mb-4">
              <img src={booking.restaurant?.photoURL || fallback} className="w-10 h-10 rounded-sm" />
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
        {displayedBookings < bookings.length && (
          <LoadMore onLoadMore={handleLoadMore} hasMore={true} />
        )}
      </div>
    </>
  );
};

export default Profile;
