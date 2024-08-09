import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearBookingById, clearAllBookings } from "../store/bookingSlice";
import { updateUserData } from "../store/authSlice";
import { fallback } from "../assets";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button, LoadMore } from "../component";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const bookings = useSelector((state) => state.bookings);

  const userBookings = useMemo(() => {
    return bookings.filter((booking) => booking.user === userData?.uid);
  }, [bookings, userData?.uid]);
  console.log(userBookings, "userBookings");

  const [displayedBookings, setDisplayedBookings] = useState(4); // Display first 4 bookings
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    userData?.photoURL || fallback
  );
  const [phone, setPhone] = useState(userData?.phone || "");

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

  const handleSave = () => {
    try {
      if (selectedFile || phone !== userData.phone) {
        const updatedUserData = {
          ...userData,
          displayName: userData.displayName,
          phone,
          photoURL: selectedFile
            ? URL.createObjectURL(selectedFile)
            : userData.photoURL,
        };

        // Update user data in Redux store
        dispatch(updateUserData(updatedUserData));
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      // Handle error as needed
    }
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
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
          </div>
        </div>
        <p className="text-3xl font-extrabold text-tn_dark mt-4">
          Welcome {userData?.displayName || userData?.user?.name}
        </p>
        <p className="mt-1 text-base text-tn_dark mb-0">{userData?.email}</p>
        <div className="mt-4 mb-4 w-1/3">
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Enter phone number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <Button children={"Save Changes"} onClick={handleSave} />
      </div>

      <div className="container mx-auto p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl font-extrabold mb-4">
              Your Booking History
            </h2>
            <p>
              Check your past and upcoming reservations easily by viewing your
              reservation history here.
            </p>
          </div>

          <Button
            children={" Clear All Bookings"}
            bgColor="transparent"
            className="border border-black h-min mt-1 hover:bg-tn_pink hover:text-white hover:border-tn_pink duration-200 sm:inline-block block sm:w-auto w-[90%] m-auto sm:m-0"
            textColor="text-black"
            onClick={handleClearAllBookings}
          />
        </div>

        {userBookings.length === 0 ? (
          <p className="text-lg text-tn_dark">No bookings to display.</p>
        ) : (
          userBookings.slice(0, displayedBookings).map((booking, index) => (
            <div
              key={`${booking.id}-${index}`}
              className="border rounded-lg p-4 mb-4 shadow-lg flex items-start justify-between"
            >
              <div className="flex items-start justify-between">
                <img
                  src={
                    booking.restaurant?.profile_image ||
                    booking.restaurant?.galleries[0]?.image ||
                    fallback
                  }
                  className="w-20 h-16 rounded-md"
                  alt="restaurant"
                />
                <div className="ml-2">
                  <p>{booking?.restaurant?.type}</p>
                  <p className="font-bold text-xl capitalize">
                    {booking?.restaurant?.name}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm mb-2 flex justify-between items-center text-tn_dark_field">
                  <span className="underline mr-2">Date </span> {booking?.date}
                </p>
                <p className="text-sm mb-2 flex justify-between items-center text-tn_dark_field">
                  <span className="underline mr-2">Time</span> {booking?.time}
                </p>
              </div>
              <div>
                <p className="text-sm mb-2 flex justify-between items-center text-tn_dark_field">
                  <span className="underline mr-2">Number of Persons</span>
                  {booking?.seats}
                </p>
                <p className="text-sm mb-2 flex justify-between items-center text-tn_dark_field">
                  <span className="underline mr-2">Total Price</span> Dkk{" "}
                  {booking?.totalPrice}
                </p>
              </div>

              <div className="flex space-x-2">
                <Link
                  to={`/restaurant/${booking.restaurant.id}`}
                  className="hover:bg-tn_dark_field bg-tn_pink text-white text-sm px-4 py-2 rounded-lg inline-block duration-200 transition-all"
                >
                  Rebook
                </Link>

                <Button
                  children={"X"}
                  onClick={() => handleClearBooking(booking.id)}
                  textSize={"text-base"}
                  padX={"px-2"}
                  padY={"py-0"}
                  bgColor="transparent"
                  textColor="text-black"
                  className="font-bold hover:bg-tn_pink duration-200 transition-all hover:text-white"
                />
              </div>
            </div>
          ))
        )}
        {displayedBookings < userBookings.length && (
          <LoadMore onLoadMore={handleLoadMore} hasMore={true} />
        )}
      </div>
    </>
  );
};

export default Profile;
