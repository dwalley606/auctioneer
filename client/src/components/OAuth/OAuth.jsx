import React from "react";
import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../utils/auth";
import { useMutation } from "@apollo/client";
import { GOOGLE_SIGN_IN } from "../../utils/mutations";
import { auth, googleProvider } from "../../firebase/config";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [googleSignInMutation] = useMutation(GOOGLE_SIGN_IN);

  const handleGoogleClick = async () => {
    dispatch(signInStart());
    googleProvider.setCustomParameters({ prompt: "select_account" });

    try {
      console.log("Initiating Google Sign-In...");
      const resultsFromGoogle = await signInWithPopup(auth, googleProvider);
      console.log("Google Sign-In successful");

      const idToken = await resultsFromGoogle.user.getIdToken();
      console.log("ID Token obtained");

      const { email, displayName, photoURL, uid } = resultsFromGoogle.user;

      console.log("Sending GraphQL mutation for Google Sign-In...");
      const { data, errors } = await googleSignInMutation({
        variables: {
          input: {
            idToken,
            email,
            username: displayName,
            photoUrl: photoURL,
            googleId: uid,
          },
        },
      });

      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error("GraphQL errors occurred during sign-in");
      }

      if (data?.googleSignIn?.token) {
        console.log("Sign-in successful, token received");
        setToken(data.googleSignIn.token, null); // Assuming you don't have refresh token yet
        console.log("Token saved to localStorage:", data.googleSignIn.token); // Log token
        dispatch(signInSuccess(data.googleSignIn.user));
        navigate("/");
      } else {
        console.error("No token received from server");
        throw new Error("Authentication failed: No token received");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      if (error.graphQLErrors) {
        console.error("GraphQL errors:", error.graphQLErrors);
      }
      if (error.networkError) {
        console.error("Network error:", error.networkError);
      }
      dispatch(signInFailure(error.message || "An unknown error occurred"));
    }
  };

  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
}
