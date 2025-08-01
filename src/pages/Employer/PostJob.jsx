import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Input, SelectOption, Button, AutoComplete } from "../../component"; // Assuming Input is in the same folder
import { fetchExperties, postJob, updateJob } from "../../utils/Api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import { FaCalendar, FaClock, FaTrash, FaUnlock } from "react-icons/fa";
import { FaArrowDownLong, FaArrowLeftLong } from "react-icons/fa6";

const experienceLevels = [
  { id: "entry", name: "Entry" },
  { id: "mid", name: "Mid" },
  { id: "senior", name: "Senior" },
];

const shiftTimes = [
  { id: "morning", name: "Morning" },
  { id: "afternoon", name: "Afternoon" },
  { id: "evening", name: "Evening" },
  { id: "night", name: "Night" },
];

const PostJob = () => {
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const jobData = location?.state;
  ////console.log(jobData, "jobData");

  ////console.log(
  //   "jobDatajobDatajobDatajobDatajobDatajobDatajobDatajobData",
  //   jobData
  // );
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();


  const [tags, setTags] = useState([]);
  const [dropdownTags, setDropdownTags] = useState([]);
  const [newTags, setNewTags] = useState([]);



  const handleAddTag = (newTag) => {
  const isDuplicate = tags.includes(newTag) || newTags.includes(newTag);
    if (!isDuplicate) {
      setNewTags((prevTags) => [...prevTags, newTag]);
    } else {
      showErrorToast(`"${newTag}" is already added to skills!`);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewTags((prevTags) => prevTags.filter(tag => tag !== tagToRemove));
    setTags((prevTags) => prevTags.filter(tag => tag !== tagToRemove));
  };


  useEffect(() => {
      const fetchData = async () => {
        try {
          let data;
          
            data = await fetchExperties();
          
          // Set tags based on fetched skills, ensuring it's an empty array if skills are undefined
          // setTags(
          //   data.expertise
          //     ? data.expertise.map((skill) => skill.title)
          //     : []
          // );
  
          setDropdownTags(
            data.expertise ? data.expertise.map((skill) => skill.title) : []
          );
  
        } catch (error) {
          console.error(error.message || "Unable to fetch data");
        }
      };
  
      fetchData(); // Call the async function
    }, []);


  useEffect(() => {
    const uniqueTags = [...new Set([...tags, ...newTags])];
    setValue('tags', uniqueTags); // only if using useForm
  }, [tags, newTags, setValue]);

  // useEffect(() => {
  //   if (jobData?.id) {
  //     Object.entries(jobData).forEach(([key, value]) => {
  //       if (key === "certificate")
  //         setValue(key, [value.map((res) => res.title)]);
  //       else setValue(key, value);
  //     });
  //   }
  // }, []);

  // useEffect(() => {
  //   if (jobData?.id) {
  //     Object.entries(jobData).forEach(([key, value]) => {
  //       if (key === "certificate") {
  //         setValue(key, value); // Directly set the string value for certificate
  //       } else {
  //         setValue(key, value);
  //       }
  //     });
  //   }
  // }, [jobData, setValue]);


  useEffect(() => {
    if (jobData?.id) {
      Object.entries(jobData).forEach(([key, value]) => {
        if (key === "certificate") {
          if (value) {
            const tagArray = value.split(",").map(tag => tag.trim()).filter(Boolean);
            setTags(tagArray);
            // setNewTags(tagArray);
            setValue("certificate", value); // also update form value
          }
        } else {
          setValue(key, value);
        }
      });
    }
  }, [jobData, setValue]);


  const removeSeconds = (time) => {
    if (!time) return "";
    return time.split(":").slice(0, 2).join(":");  // Converts "17:13:00" → "17:13"
  };
  
  
  

  const onSubmit = async (data) => {
    const allTags = [...tags, ...newTags];
    const combinedTags = [...new Set(allTags)].join(","); // duplicates bhi hata dega
    // return false;
    ////console.log(data, "form data of job posting");
    setIsLoading(true);
    const formattedData = {
      ...data,
      shift_start_time: removeSeconds(data.shift_start_time),
      shift_end_time: removeSeconds(data.shift_end_time),
      // certificate: data.certificate || "",
      certificate: combinedTags || "",
      id: jobData?.id,
    };

    try {
      const response = jobData?.id
        ? await updateJob(formattedData)
        : await postJob(formattedData);
      if (response.status == 200) {
        if (!jobData?.id) reset();
        const toastMessage = jobData?.id
          ? "Job updated successfully!"
          : "Job posted successfully!";
        showSuccessToast(toastMessage);
        navigate("/appliers-on-job");
      } else {
        // Show dynamic error toast
        const errorMessage = jobData?.id
          ? "Error updating the job"
          : "Error posting the job";
        showErrorToast(errorMessage);
      }
      ////console.log("Job updated successfully:", response);
    } catch (error) {
      console.error("Error:", error);

      // Handle unexpected errors
      const errorMessage = jobData?.id
        ? "Unexpected error occurred while updating the job"
        : "Unexpected error occurred while posting the job";
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


    const removeSkills = (index) => {
    const afterFilterTags = tags.filter((res, i) => i != index);
    setTags(afterFilterTags);
  };

  return (
    <>
      <div className="container py-6 mb-10 px-2 sm:px-0">
        <form onSubmit={handleSubmit(onSubmit)} 
         onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
            e.preventDefault();
          }
        }}
        className="">
          <div className="shadow-2xl rounded-2xl p-4 sm:p-6 space-y-4 border">
            <div className="flex justify-between mb-10  ">
              <h2 className="text-3xl sm:text-4xl font-semibold text-tn_dark">
                Shift Details
              </h2>
              {/* <button className="flex items-center gap-2" onClick={goBack}>
                <FaArrowLeftLong /> Back
              </button> */}
            </div>

            <div className="flex flex-wrap md:flex-nowrap space-y-2 md:space-y-0 md:space-x-2">
              <div className="flex flex-col w-full">
                {/* Job Title */}
                <h2>Shift Title</h2>
                <Input
                  label="Shift Title"
                  iconColor={"#0000F8"}
                  icon={FaUnlock}
                  placeholder="Enter shift title"
                  {...register("title", {
                    required: "Title is required",
                    maxLength: 255,
                  })}
                />
                {errors.title && (
                  <span className="text-red-500">{errors.title.message}</span>
                )}
              </div>

              {/* Designation */}
              {/* <div className="flex flex-col w-full">
                <h2>Designation</h2>

                <Input
                  label="Designation"
                  iconColor={"#0000F8"}
                  icon={FaUnlock}
                  placeholder="Enter job designation"
                  {...register("designation", {
                    required: "Designation is required",
                    maxLength: {
                      value: 50,
                      message: "Max length is 50 characters",
                    },
                  })}
                />
                {errors.designation && (
                  <span className="text-red-500">
                    {errors.designation.message}
                  </span>
                )}
              </div> */}

              <div className="flex flex-col w-full">
                {/* Per Hour Rate */}
                <h2>Per-hour Rate</h2>

                <Input
                  label="Per Hour Rate"
                  iconColor={"#0000F8"}
                  icon={FaUnlock}
                  placeholder="Enter hourly rate"
                  type="number"
                  {...register("per_hour_rate", {
                    required: "Rate is required",
                    min: 0,
                  })}
                />
                {errors.per_hour_rate && (
                  <span className="text-red-500">
                    {errors.per_hour_rate.message}
                  </span>
                )}
              </div>
            </div>

            <div>
              {/* Description */}
              <h2>Shift Description</h2>
              {/* 
            <Input
              label="Description"
              placeholder="Enter job description"
              iconColor={"#0000F8"}
              icon={FaCalendar}
              type="textarea"
              {...register("description", {
                required: "Description is required",
              })}
            /> */}
              <div
                className={` appearance-none w-full px-3 py-3 border normal-case border-tn_light_grey outline-none
                 focus:bg-white focus:active:bg-white bg-white text-black rounded-md duration-200 relative`}
              >
                <span className="inline-block absolute top-4 px-1 left-[6px]">
                  <FaCalendar size={15} color="#0000F8" />
                </span>
                <textarea
                  placeholder="Enter shift description"
                  className="w-full outline-none pl-5"
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
              </div>
              {errors.description && (
                <span className="text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="flex flex-wrap md:flex-nowrap space-y-2 md:space-y-0 md:space-x-2">
              <div className="flex flex-col w-full">
                {/* Start Date */}
                <h2>Start Date</h2>

                <Input
                  label="Start Date"
                  placeholder="Select start date"
                  iconColor={"#0000F8"}
                  icon={FaCalendar}
                  type="date"
                  {...register("start_date", {
                    required: "Start date is required",
                  })}
                />
                {errors.start_date && (
                  <span className="text-red-500">
                    {errors.start_date.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col w-full">
                {/* End Date */}
                <h2>End Date</h2>

                <Input
                  label="End Date"
                  placeholder="Select end date"
                  iconColor={"#0000F8"}
                  icon={FaCalendar}
                  type="date"
                  {...register("end_date", {
                    validate: (value, { start_date }) =>
                      !value ||
                      value >= start_date ||
                      "End date must be after start date",
                  })}
                />
                {errors.end_date && (
                  <span className="text-red-500">
                    {errors.end_date.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col w-full">
                {/* Shift Start Time */}
                <h2>Shift Start Time</h2>

                <Input
                  label="Shift Start Time"
                  placeholder="Enter shift start time (HH:MM)"
                  iconColor={"#0000F8"}
                  icon={FaClock}
                  type="time"
                  {...register("shift_start_time", {
                    required: "Shift start time is required",
                    // pattern: {
                    //   value: /^([0-1]\d|2[0-3]):([0-5]\d)$/,
                    //   message: "Invalid time format",
                    // },
                  })}
                />
                {errors.shift_start_time && (
                  <span className="text-red-500">
                    {errors.shift_start_time.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col w-full">
                {/* Shift End Time */}
                <h2>Shift End Time</h2>

                <Input
                  label="Shift End Time"
                  placeholder="Enter shift end time (HH:MM)"
                  iconColor={"#0000F8"}
                  icon={FaClock}
                  type="time"
                  {...register("shift_end_time", {
                    required: "Shift end time is required",
                    validate: (value, { shift_start_time }) =>
                      value > shift_start_time ||
                      "End time must be after start time",
                  })}
                />
                {errors.shift_end_time && (
                  <span className="text-red-500">
                    {errors.shift_end_time.message}
                  </span>
                )}
              </div>
            </div>
            <div>
              <h2>Skills</h2>


                <AutoComplete
    options={dropdownTags}
    onAddTag={handleAddTag}
    selectedTags={[...newTags]}
    onRemoveTag={handleRemoveTag}
  />


  {tags?.length > 0 && (
                    <>
                      <h3 className="font-semibold mt-6 mb-1">Previously Selected Skills:</h3>
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

              {/* <Input
                label="skills"
                placeholder="Enter skills (comma-separated)"
                iconColor={"#0000F8"}
                icon={FaCalendar}
                {...register("certificate", {
                  required: "Certificate is required",
                  validate: (value) => {
                    // Convert value to a string to avoid errors if it's not a string
                    const expertiseArray = String(value)
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean);

                    return (
                      expertiseArray.length > 0 ||
                      "At least one expertise is required"
                    );
                  },
                })}
              /> */}


              {/* <Input
  type="hidden"
  {...register("certificate", {
    required: "Certificate is required",
    validate: (value) => {
      const expertiseArray = String(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      return expertiseArray.length > 0 || "At least one expertise is required";
    },
  })}
/> */}

              {errors.certificate && (
                <span className="text-red-500">
                  {errors.certificate.message}
                </span>
              )}
            </div>

            <div className="flex flex-wrap md:flex-nowrap space-y-2 md:space-y-0 md:space-x-2">
              {/* <div className="flex flex-col w-full">
                <h2>Experience Level</h2>
                <SelectOption
                  selectClassName={"border rounded-lg py-3 px-3"}
                  iconColor={"#0000F8"}
                  icon={FaCalendar}
                  options={experienceLevels}
                  {...register("experience_level", {
                    required: "Experience level is required",
                  })}
                />
                {errors.experience_level && (
                  <span className="text-red-500">
                    {errors.experience_level.message}
                  </span>
                )}
              </div> */}

              <div className="flex flex-col w-full">
                <h2>Shift Timings</h2>
                <SelectOption
                  selectClassName={"border rounded-lg py-3 px-1"}
                  iconColor={"#0000F8"}
                  icon={FaCalendar}
                  options={shiftTimes}
                  {...register("shifts", {
                    required: "Shift time is required",
                  })}
                />
                {errors.shifts && (
                  <span className="text-red-500">{errors.shifts.message}</span>
                )}
              </div>
              {/* <div className="flex flex-col w-full">
                <h2>Experience Required</h2>

                <Input
                  label="Experience Required"
                  placeholder="Enter experience required (optional)"
                  iconColor={"#0000F8"}
                  icon={FaCalendar}
                  {...register("experience_required")}
                />
              </div> */}
              <div className="flex flex-col w-full">
                {/* Location */}
                <h2>Location</h2>

                <Input
                  label="Location"
                  placeholder="Enter job location"
                  iconColor={"#0000F8"}
                  icon={FaCalendar}
                  {...register("location", {
                    required: "Location is required",
                    maxLength: 255,
                  })}
                />
                {errors.location && (
                  <span className="text-red-500">
                    {errors.location.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap md:flex-nowrap space-y-2 md:space-y-0 md:space-x-2">
              <div className="flex flex-col w-full">
                {/* Zip Code */}
                <h2>Zip Code</h2>

                <Input
                  label="Zip Code"
                  placeholder="Enter zip code"
                  iconColor={"#0000F8"}
                  icon={FaCalendar}
                  {...register("zip_code", {
                    required: "Zip code is required",
                    maxLength: {
                      value: 10,
                      message: "Max length is 10 characters",
                    },
                  })}
                />
                {errors.zip_code && (
                  <span className="text-red-500">
                    {errors.zip_code.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col w-full">
                {/* City */}
                <h2>City</h2>

                <Input
                  label="City"
                  placeholder="Enter city"
                  iconColor={"#0000F8"}
                  icon={FaCalendar}
                  {...register("city", {
                    required: "City is required",
                    maxLength: {
                      value: 30,
                      message: "Max length is 30 characters",
                    },
                  })}
                />
                {errors.city && (
                  <span className="text-red-500">{errors.city.message}</span>
                )}
              </div>
              <div className="flex flex-col w-full">
                {/* State */}
                <h2>State</h2>

                <Input
                  label="State"
                  placeholder="Enter state"
                  iconColor={"#0000F8"}
                  icon={FaCalendar}
                  {...register("state", {
                    required: "State is required",
                    maxLength: {
                      value: 30,
                      message: "Max length is 30 characters",
                    },
                  })}
                />
                {errors.state && (
                  <span className="text-red-500">{errors.state.message}</span>
                )}
              </div>
            </div>

            {/* Qualification */}
            {/* <div className="flex flex-col w-full">
              <h2>Qualification</h2>

              <Input
                label="Qualification"
                placeholder="Enter required qualification"
                iconColor={"#0000F8"}
                icon={FaCalendar}
                {...register("qualification", {
                  required: "Qualification is required",
                })}
              />
              {errors.qualification && (
                <span className="text-red-500">
                  {errors.qualification.message}
                </span>
              )}
            </div> */}

<div>
              {/* Notes */}
              <h2>Notes</h2>
              {/* 
            <Input
              label="Description"
              placeholder="Enter job description"
              iconColor={"#0000F8"}
              icon={FaCalendar}
              type="textarea"
              {...register("description", {
                required: "Description is required",
              })}
            /> */}
              <div
                className={` appearance-none w-full px-3 py-3 border normal-case border-tn_light_grey outline-none
                 focus:bg-white focus:active:bg-white bg-white text-black rounded-md duration-200 relative`}
              >
                <span className="inline-block absolute top-4 px-1 left-[6px]">
                  <FaCalendar size={15} color="#0000F8" />
                </span>
                <textarea
                  placeholder="Enter job notes"
                  className="w-full outline-none pl-5"
                  maxLength={50}
                  {...register("notes", {
                    required: "Notes is required",
                  })}
                />
              </div>
              {errors.notes && (
                <span className="text-red-500">
                  {errors.notes.message}
                </span>
              )}
            </div>

            <div className="flex flex-col w-full">
              {/* Previous Experience */}
              {/* <h2>Previous Experience</h2> */}

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  // {...register("previous_experience", {
                  //   required: "Previous experience selection is required",
                  // })}
                  {...register("previous_experience")}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  experienced shift seekers only
                </span>
              </label>
              {errors.previous_experience && (
                <span className="text-red-500">
                  {errors.previous_experience.message}
                </span>
              )}
            </div>

            {/* Submit Button */}

            {/* <Button type="submit">
              {jobData?.id ? "Update Job" : "Post Job"}
            </Button> */}
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? jobData?.id
                  ? "Updating..."
                  : "Posting..."
                : jobData?.id
                ? "Update Shift"
                : "Post Shift"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PostJob;
