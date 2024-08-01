import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";

import Auth from "../utils/auth";
import { SIGNUP_USER } from "../utils/mutations";
import OAuth from "../components/OAuth/OAuth";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

function Signup() {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const [signupUser, { error: mutationError }] = useMutation(SIGNUP_USER);
  const { loading, error: reduxError } = useSelector((state) => state.user);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting form with:", formState);

    if (!formState.username || !formState.email || !formState.password) {
      const errorMsg = "Please fill in all fields";
      dispatch(signInFailure(errorMsg));
      console.log("Sign-up error:", errorMsg);
      return;
    }

    try {
      dispatch(signInStart());

      const { data } = await signupUser({
        variables: {
          username: formState.username,
          email: formState.email,
          password: formState.password,
        },
      });

      if (data.signup.errors) {
        throw new Error(data.signup.errors[0].message);
      }

      console.log("Signup response data:", data);
      const token = data.signup.token;
      Auth.login(token);
      dispatch(signInSuccess(data.signup.user));
    } catch (e) {
      console.error("Signup error:", e);
      dispatch(signInFailure(e.message));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <div className="container my-1">
      <h2>Signup</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="flex-row space-between my-2">
          <Label htmlFor="username">Username:</Label>
          <TextInput
            placeholder="Username"
            name="username"
            type="text"
            id="username"
            onChange={handleChange}
            autoComplete="username"
            value={formState.username}
            required
          />
        </div>
        <div className="flex-row space-between my-2">
          <Label htmlFor="email">Email:</Label>
          <TextInput
            placeholder="youremail@test.com"
            name="email"
            type="email"
            id="email"
            onChange={handleChange}
            autoComplete="email"
            value={formState.email}
            required
          />
        </div>
        <div className="flex-row space-between my-2">
          <Label htmlFor="password">Password:</Label>
          <TextInput
            placeholder="******"
            name="password"
            type="password"
            id="password"
            onChange={handleChange}
            autoComplete="new-password"
            value={formState.password}
            required
          />
        </div>
        {mutationError && (
          <Alert color="failure">
            Error signing up: {mutationError.message}
          </Alert>
        )}
        {reduxError && <Alert color="failure">{reduxError}</Alert>}
        <div className="flex-row flex-end">
          <Button
            gradientDuoTone="purpleToPink"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
          <OAuth />
        </div>
      </form>
      <div className="flex gap-2 text-small mt-5">
        <span>Already have an account?</span>
        <Link to="/login" className="text-blue-500">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
