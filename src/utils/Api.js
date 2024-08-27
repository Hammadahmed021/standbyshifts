import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_APP_KEY; // Ensure this is correctly set
// const TOKEN = "CUso6eFZl1LmPsUGrFMKf15tcS5FElsqOoWXBbtj2PUxRAI5HTVuxOPZyLmL";


export const getListDetails = async (url, params) => {
  try {
    const { data } = await axios.get(`${BASE_URL}${url}`, {
      params: {
        ...params,
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

export const Signup = async (userData) => {
  try {
    const { email, fname, password } = userData;
    const payload = {
      name: fname,
      email,
      password,
      type: "user",
    };

    const response = await axios.post(`${BASE_URL}signup`, payload);
    console.log(response, "response");

    return response.data;
  } catch (error) {
    console.error("Signup request failed:", error.response || error.message);
    throw error;
  }
};

export const Login = async (userData) => {
  console.log(userData, "userData");
  try {
    const { email, fname, password } = userData;
    const payload = {
      // name: fname,
      email,
      password,
      type: "user",
    };
    console.log(payload, "payload");

    const response = await axios.post(`${BASE_URL}login`, payload);
    console.log(response, "payload");

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

export const updateUserProfile = async (userData) => {
  const token = localStorage.getItem("webToken");
 

  const { name, phone, profile_image, user_id } = userData;
  console.log(userData, "userData api");

  // Create FormData object
  const formData = new FormData();
  formData.append("user_id", user_id);
  formData.append("name", name);
  formData.append("phone", phone);

  // Append the profile image only if it's present
  if (profile_image) {
    formData.append("profile_image", profile_image);
  }

  // Log the FormData content as a JSON object
  console.log(Object.fromEntries(formData), "form data from api");

  try {
    const data = await axios.post(`${BASE_URL}update-profile`, formData, {
      params: {
        api_key: API_KEY,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(data.data.user, "data for api");

    return data;
  } catch (error) {
    console.log("Error in updating user profile: ", error);
    throw new Error("Error in updating user profile");
  }
};

export const verifyUser = async () => {
  const token = localStorage.getItem("webToken");


  try {
    const data = await axios.get(`${BASE_URL}verify`, {
      params: {
        api_key: API_KEY,
      },
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

export const getUserFromGmailLogin = async (email) => {
  // const { email } = userData;
  const payload = {
    email,
  };
  try {
    const response = await axios.post(`${BASE_URL}socialLogin`, payload);
    console.log(response, "response");

    return response;
  } catch (error) {
    console.log(error, "error getting user from gmail");

    throw new Error("something went wrong");
  }
};

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
