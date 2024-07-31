import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";

import Auth from "../utils/auth";
import { SIGNUP_USER } from "../utils/mutations";
import OAuth from "../components/OAuth/OAuth";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";

function Signup(props) {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [signupUser, { error }] = useMutation(SIGNUP_USER);
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await signupUser({
        variables: {
          email: formState.email,
          password: formState.password,
          firstName: formState.firstName,
          lastName: formState.lastName,
        },
      });
      const token = mutationResponse.data.addUser.token;
      Auth.login(token);
    } catch (e) {
      console.error(e);
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
          <Label htmlFor="firstName">First Name:</Label>
          <TextInput
            placeholder="First"
            name="firstName"
            type="text"
            id="firstName"
            onChange={handleChange}
            autoComplete="given-name"
          />
        </div>
        <div className="flex-row space-between my-2">
          <Label htmlFor="lastName">Last Name:</Label>
          <TextInput
            placeholder="Last"
            name="lastName"
            type="text"
            id="lastName"
            onChange={handleChange}
            autoComplete="family-name"
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
          />
        </div>
        {error ? (
          <div>
            <p className="error-text">Error signing up. Please try again.</p>
          </div>
        ) : null}
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
      {errorMessage && (
        <Alert className="mt-5" color="failure">
          {errorMessage}
        </Alert>
      )}
    </div>
  );
}

export default Signup;
