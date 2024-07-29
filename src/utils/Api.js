import axios from "axios";
import { auth } from "../service/firebase";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_APP_KEY; // Ensure this is correctly set

export const getListDetails = async (url, params) => {
  try {
    const { data } = await axios.get(`${BASE_URL}${url}`, {
      params: {
        ...params,
        api_key: API_KEY,
      },
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const Signup = async (userData) => {
  try {
    const { email, fname } = userData;
    const payload = {
      name: fname,
      email,
      type: "user",
    };
    const response = await axios.post(`${BASE_URL}signup`, payload);
    return response.data;
  } catch (error) {
    console.error("Signup request failed:", error.response || error.message);
    throw error;
  }
};

export const Login = async (userData) => {
  try {
    const { email, fname } = userData;
    const payload = {
      name: fname,
      email,
      type: "user",
    };
    const response = await axios.post(`${BASE_URL}login`, payload);
    return response.data;
  } catch (error) {
    console.error("API Login request failed:", error.response);
    throw error;
  }
};
