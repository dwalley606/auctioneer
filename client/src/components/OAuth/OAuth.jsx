import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../../src/firebase";
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../../utils/auth"; // Import saveToken

export default function OAuth() {
  const currentUser = useSelector((state) => state.user.currentUser); // Specific selector
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      console.log("Starting Google sign-in process...");
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      console.log("Google sign-in result:", resultsFromGoogle);
      console.log("Google user:", resultsFromGoogle.user);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: resultsFromGoogle.user.displayName,
            email: resultsFromGoogle.user.email,
            googlePhotoUrl: resultsFromGoogle.user.photoURL,
          }),
          credentials: "include",
        }
      );
      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);

      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok) {
        console.log("Google sign-in successful:", data);
        saveToken(data.token); // Save token to cookies
        console.log("Token saved:", data.token); // Debugging line
        dispatch(signInSuccess(data));
        console.log("Current user after sign-in:", currentUser); // Debugging line
        navigate("/");
      } else {
        console.log("Google sign-in failed with status:", res.status);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
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
