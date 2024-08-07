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
// export const getHotelDetails = async (url, params) => {
//   try {
//     const { data } = await axios.get(`${BASE_URL}${url}`, {
//       params: {
//         ...params,
//         api_key: API_KEY,
//       },
//     });
//     console.log("Hotel details response:", data); // Log the response to the console
//     return data;
//   } catch (error) {
//     console.error("Error fetching hotel details:", error.message); // Log the error message to the console
//     return error;
//   }
// };

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
  console.log("Booking object before API call:", booking);
  try {
    const response = await axios.post(
      `${BASE_URL}save-table-booking`,
      booking,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error request data:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

