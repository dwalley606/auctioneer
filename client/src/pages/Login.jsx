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
      const token = mutationResponse.data.login.token;
      console.log("Login response data:", mutationResponse.data);

      AuthService.login(token);
      dispatch(signInSuccess(mutationResponse.data.login.user));
      navigate("/");
    } catch (error) {
      console.error("Sign-in error:", error.message);
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleFormSubmit}>
        <h2 className="title">Login</h2>
        <div className="input-group">
          <Label htmlFor="email" className="label">
            Email
          </Label>
          <TextInput
            type="email"
            name="email"
            id="email"
            placeholder="Your Email"
            value={formState.email}
            onChange={(e) =>
              setFormState({ ...formState, email: e.target.value })
            }
            className="input"
          />
        </div>
        <div className="input-group">
          <Label htmlFor="password" className="label">
            Password
          </Label>
          <TextInput
            type="password"
            name="password"
            id="password"
            placeholder="Your Password"
            value={formState.password}
            onChange={(e) =>
              setFormState({ ...formState, password: e.target.value })
            }
            className="input"
          />
        </div>
        {mutationError && (
          <Alert color="failure">{mutationError.message}</Alert>
        )}
        {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner /> : "Login"}
        </Button>
      </form>
      <OAuth />
      <div className="footer">
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
