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
  Modal,
  ToggleAvailability,
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
} from "../../utils/Api";
import { updateFirebasePassword } from "../../service";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import {
  FaAdjust,
  FaClipboard,
  FaEnvelope,
  FaLocationArrow,
  FaLock,
  FaPen,
  FaPhone,
  FaTrash,
  FaUser,
} from "react-icons/fa";
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
  const [dropdownTags, setDropdownTags] = useState([]);
  const [newTags, setNewTags] = useState([]);
  const [fetchUser, setFetchUser] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [savedExperiences, setSavedExperiences] = useState([]);
  const [editExperiences, setEditExperiences] = useState({});
  const [editIndex, setEditIndex] = useState(null); // Track which experience is being edited
  const [isVisible, setIsVisible] = useState(false); // Track which experience is being edited
  const [togglePassword, setTogglePassword] = useState(false);
  const [hideProfile, setHideProfile] = useState(false); // State for hiding the profile section



  // Predefined options for the autocomplete dropdown
  // const options = tags;

  const userType = userData?.user?.type || userData?.type || localStorage.getItem("userType");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data;
        if (userType === "employee") {
          data = await fetchProfileDataEmployee();
        } else {
          throw new Error("Invalid user type"); // Handle unexpected user type
        }
        setFetchUser(data);
        ////console.log("data.profile.work_histories", data.profile.work_histories);
        setSavedExperiences(data.profile.work_histories);
        // Set tags based on fetched skills, ensuring it's an empty array if skills are undefined
        setTags(
          data.profile.expertise
            ? data.profile.expertise.map((skill) => skill.title)
            : []
        );

        setDropdownTags(
          data.expertise ? data.expertise.map((skill) => skill.title) : []
        );

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
    ////console.log(tags, "all tags");
  }, [tags]);

  const handleAddTag = (newTag) => {
    if (!newTags.includes(newTag)) {
      setNewTags((prevTags) => [...prevTags, newTag]);
    }
  };

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
      email: currentUser?.email || "",
      address: fetchUser?.employee?.address || "",
      zip: fetchUser?.employee?.zip_code || "",
      short_description: currentUser?.short_description,
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
  const selectedLayout = watch("layout");
  ////console.log(selectedLayout, 'selectedLayout');

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
    ////console.log(data, "form data");

    setIsSigning(true);
    setSuccessMessage(""); // Clear previous success message
    let profileImageFile = selectedFile;
    let profileBannerFile = selectedBanner;

    try {
      const { newPassword, confirmPassword, address, zip, short_description } =
        data;

      // Password update logic (if needed)
      if (newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          setShowError("Passwords do not match.");
          return;
        }

        const passwordUpdated = await updateFirebasePassword(newPassword);
        if (!passwordUpdated) {
          setShowError("Failed to update password. Please try again.");
          return;
        }
      }

      // Merge new experiences with existing fetched experiences
      const allExperiences = [
        // ...fetchUser?.profile?.work_histories || [], // Existing experiences from the user profile
        ...savedExperiences, // Newly added/edited experiences
      ];

      // Construct the updated user data object
      const updatedUserData = {
        name: data.name,
        phone: data.phone,
        ...(profileImageFile &&
          profileImageFile !== currentUser?.employee?.profile_image && {
          profile_picture: profileImageFile,
        }), // Use existing profile picture if not updated
        location: address || "",
        zip_code: zip || "",
        short_description: short_description || "",
        layout: data.layout,
        industry_id:
          selectedIndustries.length > 0 ? selectedIndustries[0].id : "",
        expertise: [...newTags, ...tags] || [],
        // skills: [...newTags,...tags] || [],
        work_history: allExperiences.map((exp) => ({
          title: exp.jobTitle || exp.title,
          description: exp.jobDesc || exp.description,
          start_month: exp.startMonth || exp.start_month,
          end_month: exp.endMonth || exp.end_month,
          start_year: exp.startYear || exp.start_year,
          end_year: exp.endYear || exp.end_year,
        })),
        ...(profileBannerFile &&
          profileBannerFile !== currentUser?.banner && {
          banner: profileBannerFile,
        }), // Use existing profile picture if not updated
      };

      ////console.log(updatedUserData, "updatedUserData");

       updateUserProfile(updatedUserData).then((res) => {
              const newUserData = {
                ...updatedUserData,
                userName: res?.data?.profile?.name,
                userImage: res?.data?.profile?.employee?.profile_picture,
              };
      
              dispatch(updateUserData(newUserData));
              setIsSigning(false);
              setSuccessMessage("Profile updated successfully!");
              navigate('/jobs')
            });

      // Update user profile on the server
      // const response = await updateUserProfile(updatedUserData);
      // if (response.status === 200 || response.status === 201) {
      //   dispatch(updateUserData(updatedUserData));
      //   setIsSigning(false);
      //   setSuccessMessage("Profile updated successfully!");
      // }
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
    try {
      const response = await verifyUser(payload);
      const data = await response.data;

      setCurrentUser(data);
      // dispatch(updateUserData(data));
      setValue("name", data?.name || "");
      setValue("phone", data?.phone || "");
      setValue("email", data?.email || "");
      setValue("address", data?.employee?.location || "");
      setValue("zip", data?.employee?.zip_code || "");
      setValue("layout", data?.layout || "");
      setValue("short_description", data?.short_description || "");
      setImagePreview(data?.employee?.profile_picture || fallback);
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

  ////console.log(savedExperiences, "savedExperiences");

  // Initialize saved experiences only when the component mounts
  // useEffect(() => {
  //   if (fetchUser?.profile?.work_histories) {
  //     setSavedExperiences(fetchUser.profile.work_histories);
  //   }
  // }, [fetchUser]);

  const saveExperience = (index) => {
    const values = getValues(`experiences.${index}`);

    const experience = {
      jobTitle: values.jobTitle,
      jobDesc: values.jobDesc,
      startMonth: values.startMonth,
      startYear: values.startYear,
      endMonth: values.endMonth,
      endYear: values.endYear,
    };

    // Update the state based on edit mode
    setSavedExperiences((prev) => {
      const updatedExperiences = [...prev]; // Copy previous experiences

      if (editIndex !== null) {
        updatedExperiences[editIndex] = experience;
        ////console.log(
        //   `Updated Experience at index ${editIndex}:`,
        //   updatedExperiences[editIndex]
        // );
      } else {
        updatedExperiences.push(experience);
        ////console.log("Appended New Experience:", experience);
      }

      return updatedExperiences; // Return the updated array
    });

    // Reset form fields after saving
    resetField(`experiences.${index}.jobTitle`);
    resetField(`experiences.${index}.jobDesc`);
    resetField(`experiences.${index}.startMonth`);
    resetField(`experiences.${index}.startYear`);
    resetField(`experiences.${index}.endMonth`);
    resetField(`experiences.${index}.endYear`);

    // Reset edit mode after saving
    setEditIndex(null);
  };

  const deleteExperience = (index) => {
    setSavedExperiences((prev) => {
      const newExperiences = prev.filter((_, i) => i !== index);
      ////console.log(`Deleted experience at index ${index}`);
      return newExperiences;
    });

    // If the deleted index was being edited, reset the edit index
    if (editIndex === index) {
      setEditIndex(null); // Clear the edit index if the experience being edited was deleted
    }
  };

  const editExperience = (index) => {
    const selectedExperience = savedExperiences[index];

    ////console.log(
    //   "kjajksvdkjvskjdvkjsbdvjkbsdlkbvkskdbvksld",
    //   selectedExperience
    // );

    if (selectedExperience) {
      setEditExperiences(selectedExperience);
      setEditIndex(index);
      setIsVisible(true);

      // setValue(`experiences.${index}.jobTitle`, selectedExperience.title);
      // setValue(`experiences.${index}.jobDesc`, selectedExperience.description);
      // setValue(
      //   `experiences.${index}.startMonth`,
      //   selectedExperience.start_month
      // );
      // setValue(`experiences.${index}.startYear`, selectedExperience.start_year);
      // setValue(`experiences.${index}.endMonth`, selectedExperience.end_month);
      // setValue(`experiences.${index}.endYear`, selectedExperience.end_year);

      // // Set the index of the experience being edited

      // // Scroll to the form
      // document
      //   .getElementById(`experienceForm_${index}`)
      //   ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Remove Skills

  const removeSkills = (index) => {
    const afterFilterTags = tags.filter((res, i) => i != index);
    setTags(afterFilterTags);
  };

  const updateExpFun = () => {
    setIsVisible(false);
    const afterFilterExp = savedExperiences.filter((res, i) => i != editIndex);
    setSavedExperiences((prev) => [...afterFilterExp, editExperiences]);
    setEditIndex(null);
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

  useEffect(() => {
    return () => {
      if (bannerPreview && bannerPreview.startsWith("blob:")) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [bannerPreview]);

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
              <div className="flex items-center justify-between overflow-hidden">
                <div className="flex items-center">
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
                <div>
                  <ToggleAvailability
                    is_available={!!currentUser?.is_available}
                  />
                </div>
              </div>

              <div className="my-6">
                <h2 className="text-3xl font-black text-tn_dark">
                  Welcome {fetchUser?.profile?.name || "N/A"}
                </h2>
                <p>You can change your profile information here.</p>
              </div>
            </div>
            {isVisible && (
              <Modal
                title={"Edit Experience"}
                onClose={() => setIsVisible(false)}
                isChilderConponent={
                  <div
                    key={editIndex}
                    // id={`experienceForm_${editIndex}`}
                    className="mb-4 border p-4 rounded bg-gray-50"
                  >
                    <div className="mb-2">
                      <label className="block mb-1">Job Title</label>
                      <input
                        // {...register(`experiences.${editIndex}.jobTitle`)}
                        placeholder="Enter your job title"
                        className="border p-2 w-full rounded"
                        defaultValue={editExperiences?.title}
                        onChange={(e) =>
                          setEditExperiences((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="mb-2">
                      <label className="block mb-1">Job Description</label>
                      <textarea
                        placeholder="Enter your job description"
                        className="border p-2 w-full rounded"
                        defaultValue={editExperiences?.description}
                        onChange={(e) =>
                          setEditExperiences((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="mb-2">
                      <label className="block mb-1">Start Date</label>
                      <span className="flex space-x-2">
                        <select
                          className="border p-2 rounded"
                          defaultValue={editExperiences?.start_month}
                          onChange={(e) => {
                            setEditExperiences((prev) => ({
                              ...prev,
                              start_month: e.target.value,
                            }));
                          }}
                        // {...register(`experiences.${editIndex}.startMonth`)}
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
                          defaultValue={editExperiences?.start_year}
                          onChange={(e) => {
                            setEditExperiences((prev) => ({
                              ...prev,
                              start_year: e.target.value,
                            }));
                          }}
                        // {...register(`experiences.${editIndex}.startYear`)}
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
                          defaultValue={editExperiences?.end_month}
                          onChange={(e) => {
                            setEditExperiences((prev) => ({
                              ...prev,
                              end_month: e.target.value,
                            }));
                          }}
                        // {...register(`experiences.${editIndex}.endMonth`)}
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
                          defaultValue={editExperiences?.end_year}
                          onChange={(e) => {
                            setEditExperiences((prev) => ({
                              ...prev,
                              end_year: e.target.value,
                            }));
                          }}
                        // {...register(`experiences.${editIndex}.endYear`)}
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
                      onClick={() => updateExpFun(editIndex)}
                      className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Update Experience
                    </button>
                  </div>
                }
              />
            )}
            <form onSubmit={handleSubmit(onSave)} className="mt-4 w-full">
              <h3 className="text-lg sm:text-2xl font-semibold text-tn_dark mb-4">
                Personal Information
              </h3>
              <span className="flex-wrap flex space-x-0 sm:space-x-2 sm:flex-nowrap">
                <span className="mb-6 w-full">
                  <Input
                    label="Name"
                    onKeyPress={handleNameKeyPress} // Prevent numbers
                    icon={FaUser}
                    {...register("name")}
                    placeholder="Enter your name"
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
                        // lengthCheck: (value) =>
                        //   value.replace(/\D/g, "").length === 11 ||
                        //   "Phone number must be exactly 10 digits after +1",

                         lengthCheck: (value) => {
                          const digits = value.replace(/\D/g, "");

                          // Allow empty input
                          if (digits.length === 0) return true;

                          // Only validate if something is entered
                          return digits.length === 11 || "Phone number must be exactly 10 digits after +1";
                        },
                        
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
                <span className="mb-6 w-full">
                  <Input
                    label="Email"
                    icon={FaEnvelope}
                    {...register("email")}
                    disabled={true} // Disable the email field
                  // placeholder="Enter your name"
                  />
                </span>
              </span>
              <span className="flex-wrap flex space-x-0 sm:space-x-2 sm:flex-nowrap">
                {/* <span className="mb-6 w-full">
                  <Input
                    label="Address"
                    {...register("address")}
                    icon={FaLocationArrow}
                    placeholder="Enter your address"
                    type="text"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </span> */}

                <span className="mb-6 w-full">
                  {" "}
                  <Input
                    label="Zip Code"
                    type="text"
                    icon={FaAdjust}
                    maxLength={10} // Restrict length to 15 digits
                    {...register("zip", {
                      // validate: {
                      //   lengthCheck: (value) =>
                      //     (value.length >= 5 && value.length <= 10) ||
                      //     "Phone number must be between 11 and 15 digits",
                      // },
                    })}
                    placeholder="Zip code"
                  />
                  {errors.zip && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.zip.message}
                    </p>
                  )}
                </span>
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

              <Button
                type="submit"
                className={`w-full  ${isSigning ? "opacity-70 cursor-not-allowed" : ""
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
          {/* <div className="w-full md:w-1/2 hidden md:flex md:ml-8  justify-end">
            <img src={relatedFallback} alt="" className="w-full md:w-[400px]" />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Profile;
