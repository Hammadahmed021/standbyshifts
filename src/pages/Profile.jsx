import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFieldArray, useForm } from "react-hook-form";
import { clearAllBookings } from "../store/bookingSlice";
import { updateUserData } from "../store/authSlice";
import { fallback, relatedFallback } from "../assets";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Loader,
  LoadMore,
  Input,
  RatingModal,
  AutoComplete,
  SelectOption,
} from "../component";
import {
  deleteAllUserBookings,
  deleteUserBooking,
  fetchProfileData,
  getUserBookings,
  giveRateToHotel,
  showFavorite,
  updateUserProfile,
  verifyUser,
} from "../utils/Api";
import { updateFirebasePassword } from "../service";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";

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
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [tags, setTags] = useState([]);
  const [fetchUser, setFetchUser] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [savedExperiences, setSavedExperiences] = useState([]);

  // Predefined options for the autocomplete dropdown
  // const options = tags;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProfileData();
        setFetchUser(data);

        // Set tags based on fetched skills, ensuring it's an empty array if skills are undefined
        setTags(data.skills ? data.skills.map((skill) => skill.title) : []);

        // Set selected industries based on fetched industries, ensuring it's an empty array if industries are undefined
        setSelectedIndustries(data.industries ? [] : []);
      } catch (error) {
        console.error(error.message || "Unable to fetch data");
      }
    };

    fetchData(); // Call the async function
  }, []); // Runs once when the component mounts

  // Log tags whenever they change
  useEffect(() => {
    console.log(tags, "all tags");
  }, [tags]);

  const handleAddTag = (newTag) => {
    if (!tags.includes(newTag)) {
      setTags((prevTags) => [...prevTags, newTag]);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: currentUser?.name || "",
      phone: currentUser?.phone || "",
      address: fetchUser?.employee?.address || "",
      zip: fetchUser?.employee?.zip_code || "",
      newPassword: "",
      confirmPassword: "",
      experiences: [
        {
          jobTitle: "", // Job title
          jobDesc: "", // Job description
          startYear: "", // Start year
          startMonth: "", // Start month
          endYear: "", // End year
          endMonth: "", // End month
        },
      ],
    },
  });
  console.log(currentUser, "currentUser");
  console.log(userData, "userData");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences", // This should match the default values above
  });
  const currentYear = new Date().getFullYear(); // Get the current year
  const years = Array.from(
    { length: currentYear - 1990 + 1 },
    (_, i) => 1990 + i
  );

  // Month options for select
  const months = [
    { id: 1, name: "January" },
    { id: 2, name: "February" },
    { id: 3, name: "March" },
    { id: 4, name: "April" },
    { id: 5, name: "May" },
    { id: 6, name: "June" },
    { id: 7, name: "July" },
    { id: 8, name: "August" },
    { id: 9, name: "September" },
    { id: 10, name: "October" },
    { id: 11, name: "November" },
    { id: 12, name: "December" },
  ];

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
  
    try {
      const { newPassword, confirmPassword, address, zip } = data; // Pull address and zip from form data
      let profileImageFile = selectedFile;
  
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
  
        // Update Firebase password
        const passwordUpdated = await updateFirebasePassword(newPassword);
        if (!passwordUpdated) {
          setShowError("Failed to update password. Please try again.");
          return;
        }
      }
  
      // Validate work history entries
      const validWorkHistories = savedExperiences.filter((exp) => exp.jobDesc && exp.jobTitle); // Only keep valid entries
  
      if (validWorkHistories.length === 0) {
        setShowError("At least one work history entry is required.");
        return;
      }
  
      // Construct the updated user data object
      const updatedUserData = {
        name: data.name,
        phone: data.phone,
        profile_picture: profileImageFile || currentUser?.profile_picture || null, // Use existing profile picture if not updated
        location: address || "", // Use the address from form data
        zip_code: zip || "", // Use zip code from form data
        industry_id: selectedIndustries.map((industry) => industry.id) || [], // Get industry IDs
        skills: tags || [], // Use tags state for skills
        work_history: validWorkHistories.map((exp) => ({
          title: exp.jobTitle,
          description: exp.jobDesc, // Ensure this is not empty
          start_month: exp.startMonth,
          end_month: exp.endMonth,
          start_year: exp.startYear,
          end_year: exp.endYear,
        })), // Construct work histories from savedExperiences
      };
  
      console.log(updatedUserData, "updatedUserData");
  
      // Update user profile on the server
      await updateUserProfile(updatedUserData);
  
      // Update Redux state with the new user data
      dispatch(updateUserData(updatedUserData));
  
      // Optionally, refetch the user data after a successful update
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSigning(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        setSuccessMessage(""); // Clear the success message after 3 seconds
      }, 3000);
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

    const payload = {
      userAgent,
      ipAddress,
    };
    try {
      const response = await verifyUser(payload);
      const data = await response.data;

      setCurrentUser(data);
      // dispatch(updateUserData(data));
      setValue("name", data?.name || "");
      setValue("phone", data?.phone || "");
      setValue("address", data?.employee?.location || "");
      setValue("zip", data?.employee?.zip_code || "");
    
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

  // Set initial state when the component loads
  useEffect(() => {
    if (fetchUser?.industries) {
      // Set default industries to empty or preselected values as needed
      setSelectedIndustries([]);
    }
  }, []);
  const handleFilterChange = (event) => {
    const selectedValue = event.target.value; // Extract value from event
  
    // Find the selected industry based on the value
    const selectedIndustry = fetchUser?.industries.find(
      (industry) =>
        industry.title === selectedValue || industry.id.toString() === selectedValue
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

  const saveExperience = (index) => {
    // Use getValues to get the current form values
    const values = getValues(`experiences.${index}`);
    
    const experience = {
      jobTitle: values.jobTitle,
      jobDesc: values.jobDesc,
      startMonth: values.startMonth,
      startYear: values.startYear,
      endMonth: values.endMonth,
      endYear: values.endYear,
    };

    // Add the current experience to saved experiences
    setSavedExperiences((prev) => [...prev, experience]);
    console.log(savedExperiences, 'savedExperiences'); // This will log the previous state
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
              <span className="flex-wrap flex space-x-0 sm:space-x-2 sm:flex-nowrap">
                <Input
                  label="Address"
                  {...register("address")}
                  placeholder="Enter your address"
                  className="mb-6"
                  type="text"
                />
                <Input
                  label="Zip Code"
                  type="text"
                  maxLength={15} // Restrict length to 15 digits
                  {...register("zip", {
                    validate: {
                      lengthCheck: (value) =>
                        (value.length >= 5 && value.length <= 10) ||
                        "Phone number must be between 11 and 15 digits",
                    },
                  })}
                  placeholder="Zip code"
                  className="mb-6 sm:mb-0"
                />
              </span>

              <div className="mb-6">
                <label className="block mb-2">Tags</label>
                <AutoComplete options={tags} onAddTag={handleAddTag} />
                <h3>Add new skills</h3>
                <ul className="mt-2">
                  {tags.map((tag, index) => (
                    <li
                      key={index}
                      className="px-1 text-sm rounded-full bg-tn_text_grey text-white inline-block"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <h3>My skills</h3>
                <ul className="mt-2">
                  {fetchUser?.skills?.map((tag, index) => (
                    <li
                      key={index}
                      className="px-1 text-sm rounded-full bg-tn_text_grey text-white inline-block"
                    >
                      {tag.title}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="mb-4 border p-4 rounded bg-gray-50"
                  >
                    <h3 className="font-semibold mb-2">
                      Experience {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="mb-2 text-red-500 hover:underline"
                    >
                      Remove Experience
                    </button>

                    <div className="mb-2">
                      <label className="block mb-1">Job Title</label>
                      <input
                        {...register(`experiences.${index}.jobTitle`)}
                        placeholder="Enter your job title"
                        className="border p-2 w-full rounded"
                      />
                    </div>

                    <div className="mb-2">
                      <label className="block mb-1">Job Description</label>
                      <textarea
                        {...register(`experiences.${index}.jobDesc`)}
                        placeholder="Enter your job description"
                        className="border p-2 w-full rounded"
                      />
                    </div>

                    <div className="mb-2">
                      <label className="block mb-1">Start Date</label>
                      <span className="flex space-x-2">
                        <select
                          className="border p-2 rounded"
                          {...register(`experiences.${index}.startMonth`)}
                        >
                          <option value="">Select Month</option>
                          {months.map((month) => (
                            <option key={month.id} value={month.id}>
                              {month.name}
                            </option>
                          ))}
                        </select>
                        <select
                          className="border p-2 rounded"
                          {...register(`experiences.${index}.startYear`)}
                        >
                          <option value="">Select Year</option>
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </span>
                    </div>

                    <div className="mb-2">
                      <label className="block mb-1">End Date</label>
                      <span className="flex space-x-2">
                        <select
                          className="border p-2 rounded"
                          {...register(`experiences.${index}.endMonth`)}
                        >
                          <option value="">Select Month</option>
                          {months.map((month) => (
                            <option key={month.id} value={month.id}>
                              {month.name}
                            </option>
                          ))}
                        </select>
                        <select
                          className="border p-2 rounded"
                          {...register(`experiences.${index}.endYear`)}
                        >
                          <option value="">Select Year</option>
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </span>
                    </div>

                    {/* Save Experience Button */}
                    <button
                      type="button"
                      onClick={() => saveExperience(index)}
                      className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save Experience
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    append({
                      jobTitle: "",
                      jobDesc: "",
                      startYear: "",
                      startMonth: "",
                      endYear: "",
                      endMonth: "",
                    })
                  }
                  className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add More Experience
                </button>
              </div>
              <div>
                <strong className="mt-4 block">Saved Experiences:</strong>
                {savedExperiences.length > 0 ? (
                  <ul>
                    {savedExperiences.map((experience, index) => (
                      <li key={index} className="mb-4">
                        <h2 className="font-bold">{experience.jobTitle}</h2>
                        <p>{experience.jobDesc}</p>
                        <p>
                          {experience.startMonth}/{experience.startYear} -{" "}
                          {experience.endMonth}/{experience.endYear}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No saved experiences.</p>
                )}
              </div>
              <div>
                {fetchUser?.profile?.work_histories &&
                fetchUser.profile.work_histories.length > 0 ? (
                  <ul>
                    {fetchUser.profile.work_histories.map((work, index) => (
                      <li key={work.id} className="mb-4">
                        <h2 className="font-bold">{work.title}</h2>
                        <p>{work.description}</p>
                        <p>
                          {work.start_month}/{work.start_year} -{" "}
                          {work.end_month}/{work.end_year}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No work history found.</p> // Handle the case where there are no work histories
                )}
              </div>
              <div className="mb-6">
                <SelectOption
                  label="Industries"
                  value={selectedIndustries.map((industry) => industry.title)}
                  onChange={handleFilterChange}
                  options={addAllOption(
                    fetchUser?.industries,
                    "All Industries"
                  )}
                />
                <ul>
                  {selectedIndustries.map((industry) => (
                    <li key={industry.id}>{industry.title}</li>
                  ))}
                </ul>
                <strong className="mt-4 block">Selected Industries:</strong>
                {/* <ul>
                  {selectedIndustries.map((industry) => (
                    <li key={industry.id}>{industry.title}</li>
                  ))}
                </ul> */}
                <ul>
                  {fetchUser?.profile?.industry ? (
                    <li key={fetchUser.profile.industry.id}>
                      {fetchUser.profile.industry.title}
                    </li>
                  ) : (
                    <li>No industry found.</li> // Handle the case where there is no industry
                  )}
                </ul>
              </div>
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
    </>
  );
};

export default Profile;
