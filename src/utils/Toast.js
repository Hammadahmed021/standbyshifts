// src/toast.js
import { toast } from 'react-toastify';

// Function to show a success toast notification
export const showSuccessToast = (message) => {
  toast.success(message, { autoClose: 3000 });
};

// Function to show an error toast notification
export const showErrorToast = (message) => {
  toast.error(message, { autoClose: 3000 });
};

// Function to show an info toast notification
export const showInfoToast = (message) => {
  toast.info(message, { autoClose: 3000 });
};

// Function to show a warning toast notification
export const showWarningToast = (message) => {
  toast.warn(message, { autoClose: 3000 });
};
