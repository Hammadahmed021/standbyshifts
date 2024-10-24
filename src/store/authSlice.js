import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Signup, Login as ApiLogin, sendFCMToken } from "../utils/Api";
import {
  createUserWithEmailAndPassword,
  getIdToken,
  signInWithEmailAndPassword,
  AuthErrorCodes,
} from "firebase/auth";
import { auth } from "../service/firebase";
import { getFCMToken } from "../service";
import { setNotification } from "./notificationSlice";
import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";

const initialState = {
  status: false,
  userData: null,
  loading: false,
  error: null,
};
// Function to request push notification permissions and get FCM token
const requestPushNotificationPermission = async () => {
  try {
    const permission = await PushNotifications.requestPermissions();
    if (permission.receive === "granted") {
      console.log("Push Notification permission granted");

      // Register the device for push notifications
      await PushNotifications.register();

      return new Promise((resolve, reject) => {
        // Handle the registration of the device
        const registrationListener = PushNotifications.addListener(
          "registration",
          (token) => {
            console.log(
              "Device registered for push notifications, token:",
              token.value
            );
            registrationListener.remove(); // Remove the listener after getting the token
            resolve(token.value); // Resolve the promise with the token
          }
        );

        // Handle errors
        PushNotifications.addListener("registrationError", (error) => {
          console.error("Push notification registration error:", error);
          registrationListener.remove(); // Remove the listener
          reject(error); // Reject the promise
        });
      });
    } else {
      console.log("Push Notification permission denied");
      return null;
    }
  } catch (err) {
    console.error("Error requesting push notification permission", err);
    return null;
  }
};

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ payload }, { rejectWithValue }) => {
    let user;
    try {
      const { email, password, name, type, userAgent, ipAddress } = payload;

      // Firebase authentication: create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       user = userCredential.user;

      // Fetch Firebase token for the user
      const token = await getIdToken(user);
      localStorage.setItem("webToken", token);


      // Prepare the data to be sent to your backend
      const signupData = {
        email,
        name,
        token,
        type,        // Include types in the payload
        userAgent,    // Include userAgent in the payload
        ipAddress,    // Include ipAddress in the payload
      };

      // Send signupData to your backend API
      const response = await Signup(signupData);

      // Store the token locally if needed

      // Return necessary user information for Redux store
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        ...response, // Include any other relevant response data
      };
    } catch (error) {
      if(user){
        try {
          user.delete();
        } catch (error) {
          console.log("Unable to delete user from firebase");
          
        }
      }
      return rejectWithValue(error.message);
    }
  }
);


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({payload}, { rejectWithValue }) => {
    try {
      const { email, password, type, userAgent, ipAddress } = payload;
     console.log(email, 'email');
     

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await getIdToken(user);  
      localStorage.setItem("webToken", token);


      const signinData = {
        email,
        token,
        type,        // Include types in the payload
        userAgent,    // Include userAgent in the payload
        ipAddress,    // Include ipAddress in the payload
      };

      const response = await ApiLogin(signinData);
      // console.log(response, "response");


      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        ...response,
      };
    } catch (error) {
      console.error(
        "Firebase Authentication Error:",
        error.code,
        error.message
      );
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData; // Set userData from action payload
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.loading = false;
      state.error = null;
      // remove token in localStorage
      localStorage.removeItem("webToken");
      localStorage.removeItem("userType");

    },
    updateUserData: (state, action) => {
      state.userData = {
        ...state.userData,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = true;
        state.userData = action.payload;
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = true;
        state.userData = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { login, logout, updateUserData } = authSlice.actions;

export default authSlice.reducer;
