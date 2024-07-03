import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut // Rename to avoid conflicts
} from "firebase/auth";
import { auth } from "./firebase";

// Function to sign in with Google
export const SignUpWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential) {
      console.error("Error in user Credential");
      return;
    }

    const token = credential.accessToken;
    const user = result.user;
    console.log(user, token);
    return { user, token };

  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error; // Propagate the error to be handled by the calling function
  }
};

// Function to sign up with email and password
export const SignupWithEmail = async (email, password) => {
  if (!email || !password) {
    console.error("Provide Email and Password");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(user);
    return user;

  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error; // Propagate the error to be handled by the calling function
  }
};

// Function to sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log("User signed out successfully.");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error; // Propagate the error to be handled by the calling function
  }
};
