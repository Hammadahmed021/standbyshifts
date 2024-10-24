import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Input, SelectOption, Button } from "../../component"; // Assuming Input is in the same folder
import { postJob, updateJob } from "../../utils/Api";
import { useLocation, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";

const experienceLevels = [
  { id: "entry", name: "Entry" },
  { id: "mid", name: "Mid" },
  { id: "senior", name: "Senior" },
];

const PostJob = () => {
  const location = useLocation();

  const jobData = location?.state;

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
        setValue(key, value);
      });
    }
  }, []);

  const navigate = useNavigate();
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
      if (!jobData?.id) reset();
      showSuccessToast("Job posted successfully");
      navigate("/manage-jobs");
      console.log("Job posted successfully:", response?.data);
    } catch (error) {
      showErrorToast("Error posting the job");
      console.error("Error posting the job:", error);
    }
  };

  return (
    <>
      <div className="container py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Job Title */}
          <h2>Job Title</h2>
          <Input
            label="Job Title"
            placeholder="Enter job title"
            {...register("title", {
              required: "Title is required",
              maxLength: 255,
            })}
          />
          {errors.title && (
            <span className="text-red-500">{errors.title.message}</span>
          )}

          {/* Description */}
          <h2>Description</h2>

          <Input
            label="Description"
            placeholder="Enter job description"
            type="textarea"
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <span className="text-red-500">{errors.description.message}</span>
          )}

          {/* Required Expertise */}
          <h2>Required Expertise</h2>

          <Input
            label="Required Expertise"
            placeholder="Enter expertise (comma-separated)"
            {...register("required_expertise", {
              required: "Expertise is required",
              validate: (value) =>
                value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean).length > 0 ||
                "At least one expertise is required",
            })}
          />
          {errors.required_expertise && (
            <span className="text-red-500">
              {errors.required_expertise.message}
            </span>
          )}

          {/* Per Hour Rate */}
          <h2>Per Hour Rate</h2>

          <Input
            label="Per Hour Rate"
            placeholder="Enter hourly rate"
            type="number"
            {...register("per_hour_rate", {
              required: "Rate is required",
              min: 0,
            })}
          />
          {errors.per_hour_rate && (
            <span className="text-red-500">{errors.per_hour_rate.message}</span>
          )}

          <SelectOption
            label="Experience Level"
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

          {/* Experience Required */}
          <h2>Experience Required</h2>

          <Input
            label="Experience Required"
            placeholder="Enter experience required (optional)"
            {...register("experience_required")}
          />

          {/* Start Date */}
          <h2>Start Date</h2>

          <Input
            label="Start Date"
            placeholder="Select start date"
            type="date"
            {...register("start_date", {
              required: "Start date is required",
            })}
          />
          {errors.start_date && (
            <span className="text-red-500">{errors.start_date.message}</span>
          )}

          {/* End Date */}
          <h2>End Date</h2>

          <Input
            label="End Date"
            placeholder="Select end date"
            type="date"
            {...register("end_date", {
              validate: (value, { start_date }) =>
                !value ||
                value >= start_date ||
                "End date must be after start date",
            })}
          />
          {errors.end_date && (
            <span className="text-red-500">{errors.end_date.message}</span>
          )}

          {/* Shift Start Time */}
          <h2>Shift Start Time</h2>

          <Input
            label="Shift Start Time"
            placeholder="Enter shift start time (HH:MM)"
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

          {/* Shift End Time */}
          <h2>Shift End Time</h2>

          <Input
            label="Shift End Time"
            placeholder="Enter shift end time (HH:MM)"
            type="time"
            {...register("shift_end_time", {
              required: "Shift end time is required",
              validate: (value, { shift_start_time }) =>
                value > shift_start_time || "End time must be after start time",
            })}
          />
          {errors.shift_end_time && (
            <span className="text-red-500">
              {errors.shift_end_time.message}
            </span>
          )}

          {/* Location */}
          <h2>Location</h2>

          <Input
            label="Location"
            placeholder="Enter job location"
            {...register("location", {
              required: "Location is required",
              maxLength: 255,
            })}
          />
          {errors.location && (
            <span className="text-red-500">{errors.location.message}</span>
          )}

          {/* Zip Code */}
          <h2>Zip Code</h2>

          <Input
            label="Zip Code"
            placeholder="Enter zip code"
            {...register("zip_code", {
              required: "Zip code is required",
              maxLength: {
                value: 10,
                message: "Max length is 10 characters",
              },
            })}
          />
          {errors.zip_code && (
            <span className="text-red-500">{errors.zip_code.message}</span>
          )}

          {/* Designation */}
          <h2>Designation</h2>

          <Input
            label="Designation"
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
            <span className="text-red-500">{errors.designation.message}</span>
          )}

          {/* City */}
          <h2>City</h2>

          <Input
            label="City"
            placeholder="Enter city"
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

          {/* State */}
          <h2>State</h2>

          <Input
            label="State"
            placeholder="Enter state"
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

          {/* Qualification */}
          <h2>Qualification</h2>

          <Input
            label="Qualification"
            placeholder="Enter required qualification"
            {...register("qualification", {
              required: "Qualification is required",
            })}
          />
          {errors.qualification && (
            <span className="text-red-500">{errors.qualification.message}</span>
          )}

          {/* Submit Button */}
          <Button type="submit">Post Job</Button>
        </form>
      </div>
    </>
  );
};

export default PostJob;
