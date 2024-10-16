import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_APP_KEY; // Ensure this is correctly set
// const TOKEN = "CUso6eFZl1LmPsUGrFMKf15tcS5FElsqOoWXBbtj2PUxRAI5HTVuxOPZyLmL";

export const getListDetails = async (url, user_id) => {
  try {
    // const fullUrl = user_id
    //   ? `${BASE_URL}${url}/${user_id}`
    //   : `${BASE_URL}${url}`;
    // console.log(fullUrl, user_id, "fullUrl");

    const { data } = await axios.get(`${BASE_URL}${url}/${user_id}`, {
      params: {
        // ...params,
        api_key: API_KEY,
      },
      // have to delete this one
      // headers: {
      //   Authorization: `Bearer ${TOKEN}`, // Send the token in the Authorization header
      // },
      // signal
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const dataForFilter = async (url) => {
  try {
    const { data } = await axios.get(`${BASE_URL}${url}`, {
      params: {
        api_key: API_KEY,
      },
    });
    return data;
  } catch (error) {
    throw new Error(error.message || "unable to find filters");
  }
};

export const Signup = async (payload) => {
  try {
    const {
      email,
      name,
      token,
      type, // Include types in the payload
      userAgent, // Include userAgent in the payload
      ipAddress,
    } = payload;

    const signupData = {
      email,
      name,
      token,
      type, // Include types in the payload
      userAgent, // Include userAgent in the payload
      ipAddress, // Include ipAddress in the payload
    };

    const response = await axios.post(`${BASE_URL}signup`, signupData);
    console.log(response, "response");

    return response.data;
  } catch (error) {
    console.error("Signup request failed:", error.response || error.message);
    throw error;
  }
};

export const Login = async (payload) => {
  try {
    const {
      email,
      token,
      type, // Include types in the payload
      userAgent, // Include userAgent in the payload
      ipAddress,
    } = payload;

    const signupData = {
      email,
      token,
      type, // Include types in the payload
      userAgent, // Include userAgent in the payload
      ipAddress, // Include ipAddress in the payload
    };

    const response = await axios.post(`${BASE_URL}login`, signupData);
    console.log(response, "payload login");

    return response.data;
  } catch (error) {
    console.error("API Login request failed:", error.response);
    throw error;
  }
};

// Function to fetch filtered data
export const fetchFilteredData = async (filters) => {
  try {
    const response = await axios.post(`${BASE_URL}filter`, filters, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data; // Adjust based on actual response structure
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    throw error;
  }
};

// Function to fetch bookings data

export const fetchBookings = async (booking) => {
  const token = localStorage.getItem("webToken");

  try {
    const response = await axios.post(
      `${BASE_URL}save-table-booking`,
      booking,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Error request data:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

// Functions to fetch payment stripe payment intent
export const getPayment = async (paymentData) => {
  console.log("Booking object before API call:", paymentData);
  try {
    const response = await axios.post(
      `${BASE_URL}create-payment-intent`,
      paymentData
    );
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Error request data:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

// Function to show all user bookings
export const getUserBookings = async (params) => {
  const token = localStorage.getItem("webToken");

  try {
    const { data } = await axios.get(`${BASE_URL}getUserBookings`, {
      params: {
        ...params,
        api_key: API_KEY,
      },

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    return error;
  }
};

// Function to delete user booking
export const deleteUserBooking = async (booking_id) => {
  const token = localStorage.getItem("webToken");

  try {
    const { data } = await axios.put(
      `${BASE_URL}updateUserBookingStatus/${booking_id}`,
      null,
      {
        params: {
          // ...params,
          api_key: API_KEY,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    return error;
  }
};

// Function to delete all user bookings
export const deleteAllUserBookings = async () => {
  const token = localStorage.getItem("webToken");

  try {
    const { data } = await axios.put(
      `${BASE_URL}updateUserAllBookingsStatus`,
      null,
      {
        params: {
          // ...params,
          api_key: API_KEY,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const updateEmployerProfile = async (userData) => {
  const token = localStorage.getItem("webToken");

  const {
    name,
    phone,
    location,
    zip_code,
    industry_id, // Ensure this is always an array
    logo,
    layout,
  } = userData;

  const formData = new FormData();
  formData.append("name", name);
  formData.append("phone", phone);
  formData.append("layout", layout);
  formData.append("location", location || ""); // Directly use userData
  formData.append("zip_code", zip_code || ""); // Directly use userData

  formData.append("industry_id", industry_id);

  // Append profile image if present
  if (logo) {
    formData.append("logo", logo);
  }

  // Log form data for debugging
  for (let pair of formData.entries()) {
    console.log(pair[0] + ": " + pair[1]);
  }

  try {
    const response = await axios.post(
      `${BASE_URL}employer/profile/update`,
      formData,
      {
        params: {
          api_key: API_KEY,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response.data.user, "Updated user profile data");
    return response;
  } catch (error) {
    console.error("Error in updating user profile: ", error);
    throw new Error("Error in updating user profile");
  }
};

// Function to update user profile
export const updateUserProfile = async (userData) => {
  const token = localStorage.getItem("webToken");

  const {
    name,
    phone,
    location,
    zip_code,
    industry_id, // Ensure this is always an array
    expertise, // Default to an empty array if undefined
    // skills, // Default to an empty array if undefined
    work_history, // Default to an empty array if undefined
    profile_picture,
    layout,
  } = userData;
  console.log("sljkbvklsdblkvbsdlkvbklsdbvklbdsklv", expertise);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("phone", phone);
  formData.append("layout", layout);
  formData.append("location", location || ""); // Directly use userData
  formData.append("zip_code", zip_code || ""); // Directly use userData

  formData.append("industry_id", industry_id);
  // formData.append("expertise", expertise);

  // Append skills
  expertise.forEach((skill) => formData.append("expertise[]", skill));

  // Append work history
  work_history.forEach((work, index) => {
    formData.append(`work_history[${index}][title]`, work.title);
    formData.append(`work_history[${index}][description]`, work.description);
    formData.append(`work_history[${index}][start_month]`, work.start_month);
    formData.append(`work_history[${index}][end_month]`, work.end_month);
    formData.append(`work_history[${index}][start_year]`, work.start_year);
    formData.append(`work_history[${index}][end_year]`, work.end_year);
  });

  // Append profile image if present
  if (profile_picture) {
    formData.append("profile_picture", profile_picture);
  }

  // Log form data for debugging
  for (let pair of formData.entries()) {
    console.log(pair[0] + ": " + pair[1]);
  }

  try {
    const response = await axios.post(
      `${BASE_URL}employee/profile/update`,
      formData,
      {
        params: {
          api_key: API_KEY,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response.data.user, "Updated user profile data");
    return response;
  } catch (error) {
    console.error("Error in updating user profile: ", error);
    throw new Error("Error in updating user profile");
  }
};

// Function to verify if user is logged In or not
export const verifyUser = async (payload) => {
  const token = localStorage.getItem("webToken");

  try {
    const data = await axios.post(`${BASE_URL}verify`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(data.data, "data for user profile");

    return data;
  } catch (error) {
    console.log("Error in updating user profile: ", error);
    throw new Error("Error in updating user profile");
  }
};

// Function to get user from gmail to login
export const getUserFromGmailLogin = async (email) => {
  // const { email } = userData;
  const payload = {
    email,
  };
  try {
    const response = await axios.post(`${BASE_URL}socialLogin`, payload);
    console.log(response.data, "response");

    return response;
  } catch (error) {
    console.log(error, "error getting user from gmail");

    throw new Error("something went wrong");
  }
};

// Function to get user from gmail to signup
export const getUserFromGmailSignup = async (userData) => {
  const { email, name } = userData;
  const payload = {
    name,
    email,
  };
  try {
    const response = await axios.post(`${BASE_URL}socialSignup`, payload);
    console.log(response, "response");

    return response;
  } catch (error) {
    console.log(error, "error getting user from gmail");

    throw new Error("something went wrong");
  }
};

/* Favorites */
export const addFavorite = async (hotel_id) => {
  const token = localStorage.getItem("webToken");

  try {
    const response = await axios.post(
      `${BASE_URL}favorite`,
      { hotel_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response, "response add favorite");

    return response.data;
  } catch (error) {
    throw new Error("unable to add favorites:", error?.message);
  }
};

export const showFavorite = async () => {
  const token = localStorage.getItem("webToken");

  try {
    const response = await axios.get(`${BASE_URL}user-favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response, "response show list of favorite");

    return response.data;
  } catch (error) {
    throw new Error("unable to add favorites:", error?.message);
  }
};

/* Rate */
export const giveRateToHotel = async (rateData) => {
  const token = localStorage.getItem("webToken");
  const { table_booking_id, hotel_id, user_id, rating, review } = rateData;
  try {
    const response = await axios.post(`${BASE_URL}rate`, rateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "unable to give ratings");
  }
};

export const sendFCMToken = async (fcm_token) => {
  console.log(fcm_token, "fcm_token");
  try {
    const data = await axios.post(`${BASE_URL}add-fcm-token`, fcm_token);
    return data.data;
  } catch (error) {
    throw new Error(error.message || "unable to find filters");
  }
};

// Function to show near by hotels if user allow location
export const fetchUserNearByRestaurants = async ({ payload }) => {
  const { id, latitude, longitude, page } = payload;
  console.log(id, latitude, longitude, "id, latitude, longitude");
  try {
    const response = await axios.post(`${BASE_URL}nearby-hotels`, {
      id,
      latitude,
      longitude,
      page,
    });
    console.log(response, "nearby restaurant");
    return response.data;
  } catch (error) {
    throw new Error(error || "unable to fetch nearby restaurants");
  }
};

/* Send newsletter */

export const sendNewsletter = async (newsEmail) => {
  const email = newsEmail.email;
  console.log(newsEmail, "email api newsletter");
  try {
    const response = await axios.get(
      `${BASE_URL}subscribe-newsletter/${email}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.message || "unale to send newsletter");
  }
};

export const fetchProfileDataEmployee = async () => {
  const token = localStorage.getItem("webToken");

  try {
    const response = await axios.get(`${BASE_URL}employee/profile/fetch`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data, "profile data");
    return response.data;
  } catch (error) {
    throw new Error(
      error || "something went wrong while fetching profile data"
    );
  }
};

export const fetchProfileDataEmployer = async () => {
  const token = localStorage.getItem("webToken");

  try {
    const response = await axios.get(`${BASE_URL}employer/profile/fetch`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data, "profile data");
    return response.data;
  } catch (error) {
    throw new Error(
      error || "something went wrong while fetching profile data"
    );
  }
};

// single employer data
export const fetchSingleDetailEmployer = async () => {
  const token = localStorage.getItem("webToken");

  try {
    const response = await axios.get(`${BASE_URL}employer/profile/page-data`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data, "profile data");
    return response.data;
  } catch (error) {
    throw new Error(
      error || "something went wrong while fetching profile data"
    );
  }
};

// Post a job
export const postJob = async (payload) => {
  console.log(payload, "payload post job");
  const token = localStorage.getItem("webToken");

  try {
    const response = axios.post(`${BASE_URL}employer/job/post`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.log(error || "unable to post a job");
  }
};
