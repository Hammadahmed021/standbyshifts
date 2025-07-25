import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFieldArray, useForm } from "react-hook-form";
import { clearAllBookings } from "../../store/bookingSlice";
import { updateUserData } from "../../store/authSlice";
import { fallback, relatedFallback } from "../../assets";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutCards from "../../component/Employee/LayoutCards";
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
  PreviewModal,
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
  FaLocationArrow,
  FaLock,
  FaPen,
  FaPhone,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { layoutOptions } from "../../utils/localDB";
import { showErrorToast } from "../../utils/Toast";

const MAX_FILE_SIZE_MB = 6; // Maximum file size in MB
const VALID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const ProfileExp = () => {
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

  const [prevTagsLength, setPrevTagsLength] = useState(tags.length);

  // Predefined options for the autocomplete dropdown
  // const options = tags;

  const userType = userData?.type || userData?.user?.type || localStorage.getItem("userType");

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


  useEffect(() => {
    if (fetchUser?.profile?.industry && fetchUser?.industries?.length > 0) {
      
      const matched = fetchUser.industries.find(
        (item) => item.title === fetchUser.profile.industry?.title
      );
      // console.log('fetchUser : ' , fetchUser.profile.industry);
      if (matched) {
        setSelectedIndustries([matched]); // Set previous selected value
      }
    }
  }, [fetchUser]);

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
      address: fetchUser?.employee?.address || "",
      zip: fetchUser?.employee?.zip_code || "",
      short_description: currentUser?.short_description,
      newPassword: "",
      confirmPassword: "",

      experiences: [
        {
          jobTitle: "", // Job title
          jobDesc: "", // Job description
          //   startYear: "", // Start year
          //   startMonth: "", // Start month
          //   endYear: "", // End year
          //   endMonth: "", // End month
        },
      ],
    },
  });

  const [errorMessage, setErrorMessage] = useState(""); // State for error prompt

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Automatically update the form when tags or newTags change (No Duplicates)
  useEffect(() => {
    const uniqueTags = [...new Set([...tags, ...newTags])]; // Remove duplicates
    setValue('tags', uniqueTags);
  }, [tags, newTags, setValue]);

  // Add new tag only if it's unique
  const handleAddTag = (newTag) => {
    const isDuplicate = tags.includes(newTag) || newTags.includes(newTag); // Check both arrays
    if (!isDuplicate) {
      setNewTags((prevTags) => [...prevTags, newTag]);
    } else {
      // Show error message if the tag is already added
      showErrorToast(`"${newTag}" is already added to skills!`);
      setTimeout(() => setErrorMessage(""), 3000); // Clear the message after 3 seconds
    }
  };


  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setNewTags((prevTags) => prevTags.filter(tag => tag !== tagToRemove));
    setTags((prevTags) => prevTags.filter(tag => tag !== tagToRemove));
  };

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
          //   start_month: exp.startMonth || exp.start_month,
          //   end_month: exp.endMonth || exp.end_month,
          //   start_year: exp.startYear || exp.start_year,
          //   end_year: exp.endYear || exp.end_year,
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
        setTags([...newTags, ...tags]);   // Sync tags with updated data
        setNewTags([]);
        setIsSigning(false);
        setSuccessMessage("Profile updated successfully!");
        navigate('/jobs')
      });


      // Update user profile on the server
      // const response = await updateUserProfile(updatedUserData);
      // if (response.status === 200 || response.status === 201) {
      //   dispatch(updateUserData(updatedUserData));

      //   // 🔥 Update local state to reflect changes without reload
      //   setTags([...newTags, ...tags]);   // Sync tags with updated data
      //   setNewTags([]);

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
    // const selectedIndustry = fetchUser?.industries.find(
    //   (industry) =>
    //     industry.title === selectedValue ||
    //     industry.id.toString() === selectedValue
    // );

     const selectedIndustry = fetchUser?.industries.find(
      (industry) => industry.id.toString() === selectedValue
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

    const jobTitle = values.jobTitle?.trim();
    const jobDesc = values.jobDesc?.trim();
      
      // Check: Don't proceed if both are empty
    if (!jobTitle || !jobDesc) {
      // alert("Please enter both title and description before saving experience.");
      return;
    }

    const experience = {
      jobTitle: values.jobTitle,
      jobDesc: values.jobDesc,
      //   startMonth: values.startMonth,
      //   startYear: values.startYear,
      //   endMonth: values.endMonth,
      //   endYear: values.endYear,
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
    // resetField(`experiences.${index}.startMonth`);
    // resetField(`experiences.${index}.startYear`);
    // resetField(`experiences.${index}.endMonth`);
    // resetField(`experiences.${index}.endYear`);

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
      // setEditExperiences(selectedExperience);
       setEditExperiences({
        title: selectedExperience.jobTitle ?? selectedExperience.title,
        description: selectedExperience.jobDesc ?? selectedExperience.description,
      });
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

    const title = editExperiences.title?.trim();
    const description = editExperiences.description?.trim();

    // Prevent update if title or description is empty
    if (!title || !description) {
      // alert("Please fill both the title and description before updating.");
      return;
    }

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



  const transformedProfile = {
      bannerImg: bannerPreview || fallback,
      image: imagePreview || fallback,
      title: watch("name") || "No Name",
      description: watch("short_description") || "No Description",
      layout: watch("layout") || "1",
    };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row items-start justify-between mb-4">
          <div className="w-full md:w-7/12 p-6 shadow-md mx-auto rounded-2xl border">

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

                    {/* <div className="mb-2">
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
                    </div> */}

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

              <div className="">
                <h3 className="text-lg sm:text-2xl font-semibold text-tn_dark mb-4">
                  Work Experience
                </h3>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold">Tags</label>
                  <AutoComplete
                    options={dropdownTags}
                    onAddTag={handleAddTag}
                    selectedTags={[...newTags]}
                    onRemoveTag={handleRemoveTag}
                  />
                  {/* <ul className="space-x-1">
                    {newTags.map((tag, index) => (
                      <li
                        key={index}
                        className="px-1 text-sm rounded-full bg-tn_text_grey text-white inline-block"
                      >
                        {tag}
                        <FaTrash
                          onClick={() => handleRemoveTag(tag)}
                          size={11}
                          className="cursor-pointer hover:text-red-400"
                        />
                      </li>
                    ))}
                  </ul> */}
                  {tags?.length > 0 && (
                  <>
                    <h3 className="font-semibold mt-6 mb-1">My skills:</h3>
                    <ul className="mb-4 flex gap-2 flex-wrap">
                      {tags?.map((tag, index) => (
                        <li
                          key={index}
                          className="px-2 py-1 text-xs rounded-full bg-tn_text_grey text-white inline-flex gap-2 items-center"
                        >
                          {tag}
                          <FaTrash
                            onClick={() => removeSkills(index)}
                            size={11}
                            className="cursor-pointer"
                          />
                        </li>
                      ))}
                    </ul>
                  </>
                  )}
                </div>

                <div className="mb-6">
                  {fields.map((field, index) => {
                    const isFilled = field.jobTitle.trim() !== "" || field.jobDesc.trim() !== ""; // Check if fields are filled
                    return (
                      <div
                        key={field.id}
                        id={`experienceForm_${index}`}
                        className="mb-4 border p-4 rounded bg-gray-50"
                      >
                        <h3 className="font-semibold mb-2">
                          Experience
                        </h3>

                        {isFilled && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="mb-2 text-red-500 hover:underline"
                          >
                            Remove Experience
                          </button>
                        )}

                        <div className="mb-2">
                          <label className="block mb-1">Shift Title</label>
                          <input
                            {...register(`experiences.${index}.jobTitle`)}
                            placeholder="Enter your shift title"
                            className="border p-2 w-full rounded"
                          />
                        </div>

                        <div className="mb-2">
                          <label className="block mb-1">Shift Description</label>
                          <textarea
                            {...register(`experiences.${index}.jobDesc`)}
                            placeholder="Enter your shift description"
                            className="border p-2 w-full rounded"
                          />
                        </div>

                        {/* Save Experience Button */}
                        <button
                          type="button"
                          onClick={() => saveExperience(index)}
                          className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          {editIndex === index
                            ? "Update Experience"
                            : "Add Experience"}
                        </button>
                      </div>
                    );
                  })}

                  {/* Conditionally render "Add More Experience" button only if at least one experience is filled */}
                  {fields.some((field) => field.jobTitle.trim() !== "" || field.jobDesc.trim() !== "") && (
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
                  )}
                </div>


                {savedExperiences.length > 0 && (<div>
                  <strong className="mt-4 block mb-6">Saved Experience:</strong>
                  <div>
                    {(savedExperiences.map((work, index) => {
                        ////console.log("experio", index, work);
                        return (
                          <ul>
                            <li key={index} className="mb-4 relative border-b pb-4 space-y-1">
                              <h2 className="font-medium text-base">
                                <span className="font-semibold">Shift Title:</span> <br />{work.jobTitle ?? work.title}
                              </h2>
                              <p className="text-base"><span className="font-semibold">Shift Description:</span><br /> {work.jobDesc ?? work.description}</p>
                              {/* <p>
                                {work.startMonth ?? work.start_month}/
                                {work.startYear ?? work.start_year} -{" "}
                                {work.endMonth ?? work.end_month}/
                                {work.endYear ?? work.end_year}
                              </p> */}
                              {/* Edit button (Pen icon) */}
                              <button
                                type="button"
                                onClick={() => editExperience(index)} // This function will take the user to the form with pre-filled data
                                className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
                              >
                                <FaPen />
                              </button>
                              {/* Delete button */}
                              <button
                                type="button"
                                onClick={() => deleteExperience(index)} // This function will remove the entry
                                className="absolute top-0 right-5 text-gray-500 hover:text-gray-700"
                              >
                                <FaTrash />
                              </button>
                            </li>
                          </ul>
                        );
                      })
                    )}
                  </div>
                </div>
                )}
              </div>{" "}
              <div className="pt-6 mt-6">
                <h3 className="text-lg sm:text-2xl font-semibold text-tn_dark mb-4">
                Choose Your Industry
                </h3>
                <div className="mb-6">
                  {/* <ul className="mb-4">
                    {fetchUser?.profile?.industry ? (
                      <li className="flex gap-2 items-center" key={fetchUser.profile.industry.id}>
                        <strong className="">Industry</strong>
                        {fetchUser.profile.industry.title}
                      </li>
                    ) : (
                      <li>No business selected yet.</li> // Handle the case where there is no industry
                    )}
                  </ul> */}
                  <SelectOption
                    // label="Industries"
                    pl={"pl-0 border p-2 rounded-lg"}
                    // value={selectedIndustries.map((industry) => industry.title)}
                    value={selectedIndustries[0]?.id || ""} 
                    onChange={handleFilterChange}
                    options={addAllOption(
                      fetchUser?.industries,
                      "All Business"
                    )}
                  />
                  {/* <ul>
                    {selectedIndustries.map((industry) => (
                      <> <span>Selected Type of Business:</span> <li key={industry.id}>{industry.title}</li></>
                    ))}
                  </ul> */}
                  {/* <ul>
                  {selectedIndustries.map((industry) => (
                    <li key={industry.id}>{industry.title}</li>
                  ))}
                </ul> */}

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
                          {/* Add Your Picture */}
                          Choose a background image for profile card
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
                          Stand Out with a Short Description about You
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
                        {/* Select Layout */}
                        Select a Card Style
                      </span>
                      <div className="flex overflow-x-auto space-x-4 justify-start mb-6 pb-2 -mx-2 px-2">
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

                <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    className="shadow-xl transition duration-500 ease-in-out hover:opacity-80 rounded-[100px] w-full text-center bg-tn_dark_blue px-2 py-3 text-white"
                  >
                    Preview
                </button>
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

      {isPreviewOpen && (
         <PreviewModal onClose={() => setIsPreviewOpen(false)} title="Card Preview">
          <LayoutCards
            profile={transformedProfile}
            layout={transformedProfile.layout}
            type="employer"
          />
        </PreviewModal>
      )}

    </>
  );
};

export default ProfileExp;
