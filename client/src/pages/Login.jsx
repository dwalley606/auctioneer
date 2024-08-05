import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LOGIN_USER } from "../utils/mutations";
import AuthService from "../utils/auth";
import OAuth from "../components/OAuth/OAuth";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import "./css/Login.css";

function Login() {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const [login, { error: mutationError }] = useMutation(LOGIN_USER);
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted with data:", formState);

    if (!formState.email || !formState.password) {
      const errorMsg = "Please fill in all fields";
      dispatch(signInFailure(errorMsg));
      console.log("Sign-in error:", errorMsg);
      return;
    }

    try {
      dispatch(signInStart());

      console.log("Submitting form with:", formState);
      const mutationResponse = await login({
        variables: { email: formState.email, password: formState.password },
      });

      if (mutationResponse.errors) {
        throw new Error(mutationResponse.errors[0].message);
      }

      console.log("Login response data:", mutationResponse.data);
      const token = mutationResponse.data.login.token;
      AuthService.login(token, null); // Assuming you don't have refresh token yet
      console.log("Token saved to localStorage:", token); // Log token
      dispatch(signInSuccess(mutationResponse.data.login.user));
      navigate("/");
    } catch (e) {
      console.error("Login error:", e);
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
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="flex-row space-between my-2">
          <Label htmlFor="email">Email address:</Label>
          <TextInput
            placeholder="youremail@test.com"
            name="email"
            type="email"
            autoComplete="email"
            id="email"
            onChange={handleChange}
            value={formState.email}
            required
          />
        </div>
        <div className="flex-row space-between my-2">
          <Label htmlFor="pwd">Password:</Label>
          <TextInput
            placeholder="******"
            name="password"
            type="password"
            autoComplete="current-password"
            id="pwd"
            onChange={handleChange}
            value={formState.password}
            required
          />
        </div>
        {mutationError ? (
          <Alert color="failure">
            Error signing in: {mutationError.message}
          </Alert>
        ) : null}
        {errorMessage ? <Alert color="failure">{errorMessage}</Alert> : null}
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
              "Sign In"
            )}
          </Button>
          <OAuth />
        </div>
      </form>
      <div className="flex gap-2 text-small mt-5">
        <span>Don't Have An Account?</span>
        <Link to="/signup" className="text-blue-500">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Login;
