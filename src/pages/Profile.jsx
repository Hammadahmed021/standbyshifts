import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { clearAllBookings } from "../store/bookingSlice";
import { updateUserData } from "../store/authSlice";
import { fallback, relatedFallback } from "../assets";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Loader, LoadMore, Input } from "../component";
import {
  deleteAllUserBookings,
  deleteUserBooking,
  getUserBookings,
  showFavorite,
  updateUserProfile,
  verifyUser,
} from "../utils/Api";
import { updateFirebasePassword } from "../service";

const MAX_FILE_SIZE_MB = 2; // Maximum file size in MB
const VALID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const bookings = useSelector((state) => state.bookings);
  const [userBooking, setUserBooking] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [displayedBookings, setDisplayedBookings] = useState(4);
  const [displayedFavorites, setDisplayedFavorites] = useState(4);
  const [imagePreview, setImagePreview] = useState(fallback);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [showError, setShowError] = useState("");
  const [isSigning, setIsSigning] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isClearBooking, setIsClearBooking] = useState({});
  const [isClearingAllBookings, setIsClearingAllBookings] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: currentUser?.name || "",
      phone: currentUser?.phone || "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  console.log(currentUser, "currentUser");

  // Check if the user logged in via Gmail
  const isGmailUser = userData?.loginType === "google.com";
  console.log(isGmailUser, "isGmailUser");
  console.log(userData?.loginType, "userData?.loginType");

  const userBookings = bookings.filter(
    (booking) => booking.user === userData?.uid
  );

  const handleClearBooking = async (bookingId) => {
    setIsClearBooking((prev) => ({ ...prev, [bookingId]: true }));

    try {
      const response = await deleteUserBooking(bookingId);
      if (response.message === "Booking Status Changed Successfully") {
        showBookings(); // Refresh or update the bookings list
      }
    } catch (error) {
      console.error("Error clearing booking:", error);
    } finally {
      setIsClearBooking((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleClearAllBookings = async () => {
    setIsClearingAllBookings(true); // Set loading state to true
    try {
      const response = await deleteAllUserBookings();
      console.log(response, "response success");

      dispatch(clearAllBookings()); // Update Redux state
      setUserBooking([]); // Clear local state
    } catch (error) {
      console.error("Unable to delete all bookings:", error);
    } finally {
      setIsClearingAllBookings(false); // Reset loading state
    }
  };

  const handleLoadMore = () => {
    setDisplayedBookings(displayedBookings + 4);
  };
  const hasMore = displayedBookings < userBooking.length;

  const handleLoadMoreFav = () => {
    setDisplayedFavorites(displayedFavorites + 4);
  };
  const hasMoreFav = displayedFavorites < favorites.length;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!VALID_IMAGE_TYPES.includes(file.type)) {
        setFileError(
          "Invalid file type. Only JPEG, PNG, and JPG files are allowed."
        );
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setFileError(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      setFileError("");
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadProfileImage = async (file) => {
    try {
      // Implement your image upload logic here
      // For demonstration, returning a placeholder URL
      return new Promise((resolve) => {
        setTimeout(() => resolve(URL.createObjectURL(file)), 1000);
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const onSave = async (data) => {
    setIsSigning(true);
    setSuccessMessage(""); // Clear previous success message
    try {
      const { newPassword, confirmPassword } = data;
      // let profileImageURL = currentUser?.profile_image;
      let profileImageFile = selectedFile;

      // Ensure newPassword and confirmPassword match
      if (newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          setShowError("Passwords do not match.");
          return;
        }

        // Ensure newPassword is provided
        if (!newPassword) {
          setShowError("New password is required.");
          return;
        }

        // Update Firebase password
        const passwordUpdated = await updateFirebasePassword(newPassword);
        if (!passwordUpdated) {
          setShowError("Failed to update password. Please try again.");
          return;
        }
      }

      // If a new image is selected, prepare to upload it
      if (selectedFile) {
        profileImageFile = selectedFile;
      }

      // Construct the updated user data object
      const updatedUserData = {
        user_id: currentUser?.id || userData?.user?.id,
        name: data?.name,
        phone: data?.phone,
        // Add the profile_image key only if a new image was uploaded
        ...(profileImageFile !== currentUser?.profile_image && {
          profile_image: profileImageFile,
        }),
      };

      console.log(updatedUserData, "updatedUserData");

      // Update user profile on the server
      await updateUserProfile(updatedUserData);

      // Update Redux state with the new user data
      dispatch(updateUserData(updatedUserData));

      // Optionally, refetch the user data after a successful update
      fetchUserData();
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        setSuccessMessage(""); // Clear the success message after 5 seconds
      }, 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSigning(false);
    }
  };

  const showBookings = async () => {
    try {
      setLoading(true);
      const response = await getUserBookings();
      console.log(response, "user bookings");

      setUserBooking(response);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await verifyUser();
      const data = await response.data;
      console.log(data, "data on fetch");

      setCurrentUser(data);
      // dispatch(updateUserData(data));
      setValue("name", data?.name || "");
      setValue("phone", data?.phone || "");
      setImagePreview(data?.profile_image || fallback);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [setValue]);

  useEffect(() => {
    // Fetch favorites when component mounts
    const fetchFavorites = async () => {
      try {
        const data = await showFavorite();
        setFavorites(data);
        setLoadingFavorites(false);
      } catch (error) {
        setError(error.message);
        setLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, []);
  console.log(favorites, "fav");

  useEffect(() => {
    showBookings();
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Prevent numbers in text fields
  const handleNameKeyPress = (e) => {
    const charCode = e.keyCode || e.which;
    const charStr = String.fromCharCode(charCode);
    if (!/^[a-zA-Z]+$/.test(charStr)) {
      e.preventDefault();
    }
  };

  // Prevent non-numeric input in phone number and limit length
  const handlePhoneKeyPress = (e) => {
    const charCode = e.keyCode || e.which;
    const charStr = String.fromCharCode(charCode);
    if (!/^[0-9]+$/.test(charStr)) {
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row items-start justify-between mb-4">
          <div className="w-full md:w-1/2">
            <div className="flex flex-col">
              <div className="flex items-center overflow-hidden">
                <img
                  src={imagePreview}
                  alt="user profile"
                  className="w-16 h-16 rounded-full"
                />
                <div className="ml-4">
                  <input type="file" onChange={handleFileChange} />
                  {fileError && <p className="text-red-500">{fileError}</p>}
                </div>
              </div>

              <div className="my-6">
                <h2 className="text-3xl font-black text-tn_dark">
                  Welcome {currentUser?.name || "N/A"}
                </h2>
                <p>You can change your profile information here.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSave)} className="mt-4 w-full">
              <span className="flex-wrap flex space-x-0 sm:space-x-2 sm:flex-nowrap">
                <Input
                  label="Name"
                  onKeyPress={handleNameKeyPress} // Prevent numbers
                  {...register("name")}
                  placeholder="Enter your name"
                  className="mb-6"
                />
                <Input
                  label="Phone"
                  type="tel"
                  maxLength={15} // Restrict length to 15 digits
                  onKeyPress={handlePhoneKeyPress} // Prevent alphabets
                  {...register("phone", {
                    validate: {
                      lengthCheck: (value) =>
                        (value.length >= 11 && value.length <= 15) ||
                        "Phone number must be between 11 and 15 digits",
                    },
                  })}
                  placeholder="Enter your phone number"
                  className="mb-6 sm:mb-0"
                />
              </span>
              {!isGmailUser && (
                <span className="mb-6 block">
                  <span className="flex-wrap flex space-x-0 sm:space-x-2 sm:flex-nowrap">
                    <Input
                      label="New Password"
                      type="password"
                      {...register("newPassword")}
                      placeholder="Enter new password"
                      // disabled={isGmailUser}
                      className="mb-6 sm:mb-0"
                    />
                    <Input
                      label="Confirm Password"
                      type="password"
                      {...register("confirmPassword")}
                      placeholder="Confirm new password"
                      // disabled={isGmailUser}
                    />
                  </span>
                  {showError && (
                    <p className="text-red-500 text-sm">{showError}</p>
                  )}
                </span>
              )}

              <Button
                type="submit"
                className={`w-full  ${
                  isSigning ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isSigning}
              >
                {isSigning ? "Saving..." : "Save changes"}
              </Button>
              {successMessage && (
                <p className="text-green-500 mt-3">{successMessage}</p>
              )}
            </form>
          </div>
          <div className="w-full md:w-1/2 hidden md:flex md:ml-8  justify-end">
            <img src={relatedFallback} alt="" className="w-full md:w-[400px]" />
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="flex items-start justify-between mb-4 flex-wrap sm:flex-nowrap">
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
            bgColor="transparent"
            className={`border border-black h-min mt-3 sm:mt-1 hover:bg-tn_pink hover:text-white hover:border-tn_pink duration-200 sm:inline-block block sm:w-auto w-[90%] m-auto sm:m-0 ${
              isClearingAllBookings ? "opacity-80 cursor-not-allowed" : ""
            }`}
            textColor="text-black"
            onClick={handleClearAllBookings}
            disabled={isClearingAllBookings} // Disable the button when clearing
          >
            {isClearingAllBookings ? "Clearing..." : "Clear All Bookings"}
          </Button>
        </div>

        {loading ? (
          <Loader />
        ) : userBooking?.length === 0 ? (
          <p className="text-lg text-tn_dark">No bookings to display.</p>
        ) : (
          userBooking?.slice(0, displayedBookings).map((booking, index) => (
            <div
              key={`${booking?.id}-${index}`}
              className="border rounded-lg p-4 mb-4 shadow-lg flex items-start justify-between flex-wrap relative"
            >
              <div className="flex items-start justify-start w-full sm:w-auto mb-2 sm:mb-0">
                <img
                  src={
                    booking.hotel?.profile_image ||
                    booking.hotel?.galleries[0]?.image ||
                    fallback
                  }
                  className="w-20 h-16 rounded-md"
                  alt="hotel"
                />
                <div className="ml-2">
                  <p>{booking?.hotel?.type}</p>
                  <p className="font-bold text-xl capitalize">
                    {booking?.hotel?.name}
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
                  {booking?.total_pay}
                </p>
              </div>

              <div className="flex space-x-2 w-full sm:w-auto sm:mt-0 mt-4">
                <Link
                  to={`/restaurant/${booking?.hotel?.id}`}
                  className="hover:bg-tn_dark_field bg-tn_pink text-white text-lg sm:text-base px-4 py-2 rounded-lg inline-block duration-200 transition-all w-full sm:w-auto text-center"
                >
                  Rebook
                </Link>

                <Button
                  onClick={() => handleClearBooking(booking?.id)}
                  padX={"px-2"}
                  padY={"py-2"}
                  className={`rounded-lg bg-tn_dark_field text-white hover:bg-tn_pink text-xs sm:text-sm absolute sm:relative top-2 right-2 sm:top-0 sm:right-0 ${
                    isClearBooking[booking?.id]
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isClearBooking[booking?.id]}
                >
                  {isClearBooking[booking?.id] ? "..." : "X"}
                </Button>
              </div>
            </div>
          ))
        )}

        {userBooking.length >= displayedBookings && (
          <LoadMore onLoadMore={handleLoadMore} hasMore={hasMore} />
        )}
      </div>

      <div className="container mx-auto p-4">
        <div className="flex items-start justify-between mb-4 flex-wrap sm:flex-nowrap">
          <div>
            <h2 className="text-3xl font-extrabold mb-4">Your Favorites</h2>
            <p>
              Check your past and upcoming restaurant easily by viewing them
              here.
            </p>
          </div>
        </div>

        {loadingFavorites ? (
          <Loader />
        ) : favorites?.length === 0 ? (
          <p className="text-lg text-tn_dark">No favorites to display.</p>
        ) : (
          favorites?.slice(0, displayedFavorites).map((favorite, index) => (
            <div
              key={`${favorite?.id}-${index}`}
              className="border rounded-lg p-4 mb-4 shadow-lg flex items-start justify-between flex-wrap relative"
            >
              <div className="flex items-start justify-start w-full sm:w-auto mb-2 sm:mb-0">
                <img
                  src={
                    favorite?.profile_image ||
                    // favorite?.galleries[0]?.image ||
                    fallback
                  }
                  className="w-20 h-16 rounded-md"
                  alt="hotel"
                />
                <div className="ml-2">
                  <p>{favorite?.type}</p>
                  <Link
                    to={`/restaurant/${favorite?.id}`}
                    className="font-bold text-xl capitalize"
                  >
                    {favorite?.name}
                  </Link>
                </div>
              </div>

              {/* <div className="flex space-x-2 w-full sm:w-auto sm:mt-0 mt-4">
                <Link
                  to={`/restaurant/${booking?.hotel?.id}`}
                  className="hover:bg-tn_dark_field bg-tn_pink text-white text-lg sm:text-base px-4 py-2 rounded-lg inline-block duration-200 transition-all w-full sm:w-auto text-center"
                >
                  Rebook
                </Link>

                <Button
                  onClick={() => handleClearBooking(booking?.id)}
                  padX={"px-2"}
                  padY={"py-2"}
                  className={`rounded-lg bg-tn_dark_field text-white hover:bg-tn_pink text-xs sm:text-sm absolute sm:relative top-2 right-2 sm:top-0 sm:right-0 ${
                    isClearBooking[booking?.id]
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isClearBooking[booking?.id]}
                >
                  {isClearBooking[booking?.id] ? "..." : "X"}
                </Button>
              </div> */}
            </div>
          ))
        )}

        {favorites.length >= displayedFavorites && (
          <LoadMore onLoadMore={handleLoadMoreFav} hasMore={hasMoreFav} />
        )}
      </div>
    </>
  );
};

export default Profile;
