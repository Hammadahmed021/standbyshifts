import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Signup, Login as ApiLogin } from "../utils/Api";
import {
  createUserWithEmailAndPassword,
  getIdToken,
  signInWithEmailAndPassword,
  AuthErrorCodes,
} from "firebase/auth";
import { auth } from "../service/firebase";

const initialState = {
  status: false,
  userData: null,
  loading: false,
  error: null,
};


export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { email, password, fname, phone } = userData;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      const user = userCredential.user;
      const token = await getIdToken(user);

      const signupData = {
        email,
        fname,
        password
      };
      // if(user){}
      const response = await Signup(signupData);

       // Store token in localStorage
      localStorage.setItem("webToken", response?.token);
        
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        phone: phone,
        ...response,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { email, password, fname } = userData;
      console.log("Starting login process...");
      console.log("Email:", email);
      console.log("Password:", password);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await getIdToken(user);


      console.log("User Credential:", userCredential);

      const signupData = {
        email,
        fname,
      };

      const response = await ApiLogin({ email, password });
       // Store token in localStorage
     localStorage.setItem("webToken", response?.token);

 

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


