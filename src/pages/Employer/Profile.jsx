import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFieldArray, useForm } from "react-hook-form";
import { clearAllBookings } from "../../store/bookingSlice";
import { updateUserData } from "../../store/authSlice";
import { fallback, relatedFallback } from "../../assets";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Loader,
  LoadMore,
  Input,
  RatingModal,
  AutoComplete,
  SelectOption,
} from "../../component";
import {
  deleteAllUserBookings,
  deleteUserBooking,
  fetchProfileDataEmployer,
  fetchProfileDataEmployee,
  getUserBookings,
  showFavorite,
  updateUserProfile,
  verifyUser,
  updateEmployerProfile,
} from "../../utils/Api";
import { updateFirebasePassword } from "../../service";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import {
  FaAdjust,
  FaClipboard,
  FaCode,
  FaLocationArrow,
  FaLock,
  FaPen,
  FaPhone,
  FaRoute,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { layoutOptions } from "../../utils/localDB";

const MAX_FILE_SIZE_MB = 6; // Maximum file size in MB
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
  const [bannerPreview, setBannerPreview] = useState(fallback);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [bannerFileError, setBannerFileError] = useState("");
  const [fileError, setFileError] = useState("");
  const [showError, setShowError] = useState("");
  const [isSigning, setIsSigning] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isClearBooking, setIsClearBooking] = useState({});
  const [isClearingAllBookings, setIsClearingAllBookings] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [tags, setTags] = useState([]);
  const [fetchUser, setFetchUser] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [savedExperiences, setSavedExperiences] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // Track which experience is being edited
  const [togglePassword, setTogglePassword] = useState(false);
  const [hideProfile, setHideProfile] = useState(false); // State for hiding the profile section

  // Predefined options for the autocomplete dropdown
  // const options = tags;
  console.log(fetchUser, "fetchUser >>>> employer");
  console.log(currentUser, "currentUser >>>> employer");

  const userType = userData?.type || userData?.user?.type || localStorage.getItem("userType");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data;
        if (userType === "employer") {
          data = await fetchProfileDataEmployer();
        } else {
          throw new Error("Invalid user type"); // Handle unexpected user type
        }
        setFetchUser(data);

        // Set selected industries based on fetched industries, ensuring it's an empty array if industries are undefined
        setSelectedIndustries(data.industries ? [] : []);
      } catch (error) {
        console.error(error.message || "Unable to fetch data");
      }
    };

    fetchData(); // Call the async function
  }, []); // Runs once when the component mounts

  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    resetField,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: currentUser?.name || "",
      phone: currentUser?.phone || "",
      address:
        currentUser?.employer?.location ||
        fetchUser?.profile?.employer?.location ||
        "",
      zip:
        currentUser?.employer?.zip_code ||
        fetchUser?.profile?.employer?.zip_code ||
        "",
      newPassword: "",
      confirmPassword: "",
      layout: "1", // Default to first layout
      about: currentUser?.about,
      short_description: currentUser?.short_description,
    },
  });
  const selectedLayout = watch("layout");

  // Check if the user logged in via Gmail
  const isGmailUser = userData?.loginType && currentUser.id;

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

  const handleFileChangeBanner = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!VALID_IMAGE_TYPES.includes(file.type)) {
        setBannerFileError(
          "Invalid file type. Only JPEG, PNG, and JPG files are allowed."
        );
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setBannerFileError(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      setBannerFileError("");
      setSelectedBanner(file);
      setBannerPreview(URL.createObjectURL(file));
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
    console.log(data, "form data");

    setIsSigning(true);
    setSuccessMessage(""); // Clear previous success message
    let profileImageFile = selectedFile;
    let profileBannerFile = selectedBanner;

    try {
      const { newPassword, confirmPassword, address, zip } = data;

      // Ensure newPassword and confirmPassword match
      if (newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          setShowError("Passwords do not match.");
          return;
        }

        if (!newPassword) {
          setShowError("New password is required.");
          return;
        }

        const passwordUpdated = await updateFirebasePassword(newPassword);
        if (!passwordUpdated) {
          setShowError("Failed to update password. Please try again.");
          return;
        }
      }

      // Construct the updated user data object
      const updatedUserData = {
        name: data.name,
        phone: data.phone,
        ...(profileImageFile &&
          profileImageFile !== currentUser?.employee?.profile_image && {
          logo: profileImageFile,
        }), // Use existing profile picture if not updated
        location: address || "",
        zip_code: zip || "",
        layout: data.layout,
        about: data.about,
        short_description: data.short_description,
        industry_id:
          selectedIndustries.length > 0 ? selectedIndustries[0].id : "",
        ...(profileBannerFile &&
          profileBannerFile !== currentUser?.banner && {
          banner: profileBannerFile,
        }), // Use existing profile picture if not updated
      };

      console.log(updatedUserData, "updatedUserData");

      // Update user profile on the server
      await updateEmployerProfile(updatedUserData);

      dispatch(updateUserData(updatedUserData));
      setIsSigning(false);
      setSuccessMessage("Profile updated successfully!");
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const getUserIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Failed to fetch IP address:", error);
      return null;
    }
  };
  const fetchUserData = async () => {
    const userAgent = navigator.userAgent;
    const ipAddress = await getUserIP();
    const token = localStorage.getItem("webToken");

    const payload = {
      userAgent,
      ipAddress,
      token,
    };
    console.log(payload, "payload");

    try {
      const response = await verifyUser(payload);
      const data = await response.data;

      setCurrentUser(data);
      // dispatch(updateUserData(data));
      setValue("name", data?.name || "");
      setValue("phone", data?.phone || "");
      setValue("address", data?.employer?.location || "");
      setValue("zip", data?.employer?.zip_code || "");
      setValue("layout", data?.layout || "");
      setValue("about", data?.about || "");
      setValue("short_description", data?.short_description || "");
      setImagePreview(data?.employer?.logo || fallback);
      setBannerPreview(data?.banner || fallback);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [setValue]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    return () => {
      if (bannerPreview && bannerPreview.startsWith("blob:")) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [bannerPreview]);

  // Prevent numbers in text fields
  const handleNameKeyPress = (e) => {
    const charCode = e.keyCode || e.which;
    const charStr = String.fromCharCode(charCode);

    // Allow alphabets and spaces only
    if (!/^[a-zA-Z ]+$/.test(charStr)) {
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

  // Set initial state when the component loads
  useEffect(() => {
    if (fetchUser?.industries) {
      // Set default industries to empty or preselected values as needed
      setSelectedIndustries([]);
    }
    console.log(fetchUser, 'fetch usser >>>');

  }, []);
  const handleFilterChange = (event) => {
    const selectedValue = event.target.value; // Extract value from event

    // Find the selected industry based on the value
    const selectedIndustry = fetchUser?.industries.find(
      (industry) =>
        industry.title === selectedValue ||
        industry.id.toString() === selectedValue
    );

    if (selectedIndustry) {
      // Set only the selected industry (allowing only one selection at a time)
      setSelectedIndustries([selectedIndustry]); // Replace the entire array with the selected one
    }
  };

  // Helper function to add "All Industries" option
  const addAllOption = (options, label) => {
    const safeOptions = options || []; // Default to an empty array if options is undefined
    return [
      { id: "all", name: label },
      ...safeOptions.map((opt) => ({ id: opt.id, name: opt.title })),
    ];
  };

  const formatPhoneNumberWithCountryCode = (value) => {
    // Remove all non-numeric characters except for the leading '+1'
    let cleanedValue = value.replace(/[^0-9]/g, "");

    // Ensure '+1' is always at the beginning
    if (cleanedValue.startsWith("1")) {
      cleanedValue = cleanedValue.slice(1);
    }

    // Format according to the US number format +1 (XXX) XXX-XXXX
    const match = cleanedValue.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const formatted = `+1 ${match[1] ? `(${match[1]}` : ""}${match[2] ? `) ${match[2]}` : ""
        }${match[3] ? `-${match[3]}` : ""}`;
      return formatted.trim();
    }
    return "+1";
  };

  const toggleText = () => {
    setTogglePassword((prev) => !prev);
  };
  const toggleProfileSection = () => {
    setHideProfile((prev) => !prev); // Toggle the hideProfile state
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row items-start justify-between mb-4">
          <div className="w-full md:w-7/12 p-6 shadow-md mx-auto rounded-2xl border">
            <div className="flex flex-col">
              <div className="flex items-center overflow-hidden">
                <img
                  src={imagePreview}
                  alt="user profile"
                  className="w-16 h-16 rounded-full"
                />
                <div className="ml-4">
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleFileChange}
                  />

                  {fileError && <p className="text-red-500">{fileError}</p>}
                </div>
              </div>

              <div className="my-6">
                <h2 className="text-3xl font-black text-tn_dark">
                  Welcome {fetchUser?.profile?.name || "N/A"}
                </h2>
                <p>You can change your profile information here.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSave)} className="mt-4 w-full">
              <h3 className="text-2xl font-semibold text-tn_dark mb-4">
                Personal Information
              </h3>
              <span className="flex-wrap flex space-x-0 sm:space-x-2 sm:flex-nowrap">
                <span className="mb-6 w-full">
                  <Input
                    label="Name"
                    icon={FaUser}
                    onKeyPress={handleNameKeyPress} // Prevent numbers
                    {...register("name")}
                    placeholder="Enter your name"
                  // className="mb-6"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </span>
                <span className="mb-6 w-full">
                  <Input
                    label="Phone"
                    type="tel"
                    icon={FaPhone} // Using the phone icon here
                    maxLength={17} // To accommodate "+1 (XXX) XXX-XXXX"
                    placeholder="+1 (123) 456-7890" // US phone format with country code
                    {...register("phone", {
                      onChange: (e) => {
                        const formattedValue = formatPhoneNumberWithCountryCode(
                          e.target.value
                        );
                        setValue("phone", formattedValue); // Update form state with formatted value
                      },
                      validate: {
                        lengthCheck: (value) =>
                          value.replace(/\D/g, "").length === 11 ||
                          "Phone number must be exactly 10 digits after +1",
                      },
                    })}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </span>
              </span>

              <span className="flex-wrap flex space-x-0 sm:space-x-2 sm:flex-nowrap">
                {/* <span className="mb-6 w-full">
                  <Input
                    label="Address"
                    {...register("address")}
                    placeholder="Enter your address"
                    icon={FaLocationArrow}
                    type="text"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </span> */}
                <span className="mb-6 w-full">
                  <Input
                    label="Zip Code"
                    type="text"
                    icon={FaAdjust}
                    maxLength={10} // Restrict length to 15 digits
                    {...register(
                      "zip"
                      // {
                      //   validate: {
                      //     lengthCheck: (value) =>
                      //       (value.length >= 5 && value.length <= 10) ||
                      //       "Zip code must be between 5 and 10 digits",
                      //   },
                      // }
                    )}
                    placeholder="Zip code"
                  />
                  {errors.zip && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.zip.message}
                    </p>
                  )}
                </span>
              </span>

              <span className="mb-6 w-full block">
                <div className="relative ">
                  <FaClipboard
                    scale={15}
                    color="#F59200"
                    className="absolute top-3 left-2"
                  />
                  <textarea
                    label="Bio"
                    rows="4" // Adjust the number of rows as needed
                    {...register("about")}
                    placeholder="About company"
                    className="pl-8 p-2 border normal-case border-tn_light_grey outline-none focus:bg-white focus:active:bg-white bg-white text-black rounded-md duration-200 w-full"
                  />
                </div>

                {errors.about && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.about.message}
                  </p>
                )}
              </span>

              {!isGmailUser && (
                <>
                  <span className="w-full block mb-6">
                    <p className="text-tn_text_grey text-sm">
                      Want to change password?{" "}
                      <span
                        className="underline cursor-pointer"
                        onClick={toggleText}
                      >
                        {togglePassword ? "hide" : "click here"}
                      </span>
                    </p>
                  </span>
                  {togglePassword && (
                    <span className="mb-6 block">
                      <span className="flex-wrap flex space-x-0 sm:space-x-2 sm:flex-nowrap">
                        <Input
                          label="New Password"
                          type="password"
                          {...register("newPassword")}
                          placeholder="Enter new password"
                          // disabled={isGmailUser}
                          className="mb-6 sm:mb-0"
                          icon={FaLock}
                        />
                        <Input
                          label="Confirm Password"
                          type="password"
                          {...register("confirmPassword")}
                          placeholder="Confirm new password"
                          // disabled={isGmailUser}
                          icon={FaLock}
                        />
                      </span>
                      {showError && (
                        <p className="text-red-500 text-sm">{showError}</p>
                      )}
                    </span>
                  )}
                </>
              )}

              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg sm:text-2xl font-semibold text-tn_dark mb-4">
                  Select Type of Business
                </h3>
                <span className="block mb-4 text-base"><strong>Type of Business:</strong> {fetchUser?.profile?.industry}</span>

                <div className="mb-6">
                  <SelectOption
                    pl={"pl-0 border p-2 rounded-lg"}
                    // label="Industries"
                    value={selectedIndustries.map((industry) => industry.title)}
                    onChange={handleFilterChange}
                    options={addAllOption(
                      fetchUser?.industries,
                      "All Business"
                    )}
                  />
                  <ul>
                    {selectedIndustries.map((industry) => (
                      <li key={industry.id}>{industry.title}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <div>
                  {/* Toggle Button */}
                  <p className="text-tn_text_grey text-sm mb-6">
                    Create your profile, {" "}
                    <span
                      onClick={toggleProfileSection}
                      className="underline cursor-pointer"
                    >
                      {hideProfile ? "Hide this" : "Click here"}
                    </span>
                  </p>

                  {/* Profile Section */}
                  {hideProfile && (
                    <>
                      <div className="overflow-hidden">
                        <h3 className="text-2xl font-semibold text-tn_dark mb-4">
                          Picture for profile
                        </h3>
                        <div className="flex items-center py-4">
                          <img
                            src={bannerPreview}
                            alt="user profile"
                            className="w-32 h-16 rounded-lg border"
                          />
                          <div className="ml-4">
                            <input
                              type="file"
                              accept=".jpg, .jpeg, .png"
                              onChange={handleFileChangeBanner}
                            />

                            {bannerFileError && (
                              <p className="text-red-500">{bannerFileError}</p>
                            )}
                          </div>
                        </div>
                        <span className="mb-6 w-full block">
                          <span className="mt-6 mb-2 font-semibold block">
                          Provide a Short Description of your Business
                          </span>
                          <div className="relative">
                            <FaClipboard
                              scale={15}
                              color="#F59200"
                              className="absolute top-3 left-2"
                            />
                            <textarea
                              label="Short description"
                              maxLength={80}
                              rows="3"
                              {...register("short_description", {
                                validate: {
                                  lengthCheck: (value) =>
                                    (value.length >= 50 &&
                                      value.length <= 80) ||
                                    "Short description must be between 50 and 80 characters",
                                },
                              })}
                              placeholder="Enter short description"
                              className="pl-8 p-2 border normal-case border-tn_light_grey outline-none focus:bg-white focus:active:bg-white bg-white text-black rounded-md duration-200 w-full"
                            />
                            <p className="text-tn_text_grey text-sm">
                              Short description must be of 80 characters.
                            </p>
                          </div>

                          {errors.short_description && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.short_description.message}
                            </p>
                          )}
                        </span>
                      </div>

                      <span className="mt-4 block font-semibold mb-2">
                        Select Layout
                      </span>
                      <div className="flex space-x-4 justify-start mb-6">
                        {layoutOptions.map((layout) => (
                          <label key={layout.id} className="cursor-pointer">
                            <input
                              type="radio"
                              value={layout.id}
                              {...register("layout")}
                              className="hidden"
                            />
                            <div
                              className={`border ${selectedLayout === layout.id
                                  ? "border-blue-500"
                                  : "border-gray-300"
                                } rounded-lg p-2`}
                            >
                              <img
                                src={layout.imageUrl}
                                alt={layout.label}
                                className="mb-2"
                              />
                              <p>{layout.label}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 items-center justify-between my-3">
                <Button
                  type="submit"
                  className={`w-full  ${isSigning ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  disabled={isSigning}
                >
                  {isSigning ? "Saving..." : "Save changes"}
                </Button>
                <Link
                  to={"/employer-profile-view"}
                  className="shadow-xl transition duration-500 ease-in-out hover:opacity-80 rounded-[100px] w-full text-center bg-tn_dark_blue px-2 py-3 text-white"
                >
                  View Profile
                </Link>
              </div>
              {successMessage && (
                <p className="text-green-500 mt-3">{successMessage}</p>
              )}
            </form>
          </div>
          {/* <div className="w-full md:w-1/2 hidden md:flex md:ml-8  justify-end">
            <img src={relatedFallback} alt="" className="w-full md:w-[400px]" />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Profile;
