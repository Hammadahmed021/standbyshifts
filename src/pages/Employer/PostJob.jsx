import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Input, SelectOption, Button } from "../../component"; // Assuming Input is in the same folder
import { postJob, updateJob } from "../../utils/Api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import { FaCalendar, FaClock, FaUnlock } from "react-icons/fa";
import { FaArrowDownLong, FaArrowLeftLong } from "react-icons/fa6";

const experienceLevels = [
  { id: "entry", name: "Entry" },
  { id: "mid", name: "Mid" },
  { id: "senior", name: "Senior" },
];

const PostJob = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const jobData = location?.state;
  console.log(jobData, "jobData");

  console.log(
    "jobDatajobDatajobDatajobDatajobDatajobDatajobDatajobData",
    jobData
  );
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (jobData?.id) {
      Object.entries(jobData).forEach(([key, value]) => {
        if (key === "required_expertise")
          setValue(key, [value.map((res) => res.title)]);
        else setValue(key, value);
      });
    }
  }, []);

  const onSubmit = async (data) => {
    console.log(data, "form data of job posting");
    const formattedData = {
      ...data,
      required_expertise: data.required_expertise
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      id: jobData?.id,
    };

    try {
      const response = jobData?.id
        ? await updateJob(formattedData)
        : await postJob(formattedData);
      if (response.status == 200) {
        if (!jobData?.id) reset();
        showSuccessToast("Job posted successfully");
        navigate("/appliers-on-job");
      } else showErrorToast("Error posting the job");
      console.log("Job posted successfully:", response);
    } catch (error) {
      showErrorToast("Error posting the job");
      console.error("Error posting the job:", error);
    }
  };

  return (
    <>
      <div className="container py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="shadow-2xl rounded-2xl p-4 sm:p-6 space-y-4">
            <div className="flex justify-between mb-10  ">
              <h2 className="text-3xl sm:text-4xl font-semibold text-tn_dark">
                Job Details
              </h2>
              {/* <button className="flex items-center gap-2" onClick={goBack}>
                <FaArrowLeftLong /> Back
              </button> */}
            </div>

            <div className="flex flex-wrap md:flex-nowrap space-y-2 md:space-y-0 md:space-x-2">
              <div className="flex flex-col w-full">
                {/* Job Title */}
                <h2>Job Title</h2>
                <Input
                  label="Job Title"
                  iconColor={"#0000F8"}
                  icon={FaUnlock}
                  placeholder="Enter job title"
                  {...register("title", {
                    required: "Title is required",
                    maxLength: 255,
                  })}
                />
                {errors.title && (
                  <span className="text-red-500">{errors.title.message}</span>
                )}
              </div>

              <div className="flex flex-col w-full">
                {/* Designation */}
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
              </div>

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

            {/* Description */}
            <h2>Job Description</h2>

            <Input
              label="Description"
              placeholder="Enter job description"
              iconColor={"#0000F8"}
              icon={FaCalendar}
              type="textarea"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}

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
                    pattern: {
                      value: /^([0-1]\d|2[0-3]):([0-5]\d)$/,
                      message: "Invalid time format",
                    },
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

            {/* Required Expertise */}
            <h2>Required Expertise</h2>

            <Input
              label="Required Expertise"
              placeholder="Enter expertise (comma-separated)"
              iconColor={"#0000F8"}
              icon={FaCalendar}
              {...register("required_expertise", {
                required: "Expertise is required",
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
            />

            {errors.required_expertise && (
              <span className="text-red-500">
                {errors.required_expertise.message}
              </span>
            )}

            <div className="flex flex-wrap md:flex-nowrap space-y-2 md:space-y-0 md:space-x-2">
              <div className="flex flex-col w-full">
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
              </div>
              <div className="flex flex-col w-full">
                {/* Experience Required */}
                <h2>Experience Required</h2>

                <Input
                  label="Experience Required"
                  placeholder="Enter experience required (optional)"
                  iconColor={"#0000F8"}
                  icon={FaCalendar}
                  {...register("experience_required")}
                />
              </div>
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

            <div className="flex flex-col w-full">
              {/* Qualification */}
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
            </div>

            {/* Submit Button */}
            <Button type="submit">Post Job</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PostJob;
