import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { gql, request } from "graphql-request";

// Define the GraphQL mutation for login
const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

// Define the GraphQL mutation for Google Sign-In
const GOOGLE_SIGN_IN = gql`
  mutation GoogleSignIn($input: GoogleSignInInput!) {
    googleSignIn(input: $input) {
      token
      user {
        id
        username
        email
        photoUrl
      }
    }
  }
`;

// Create the async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, thunkAPI) => {
    try {
      console.log("Logging in user with data:", loginData);
      const response = await request(
        process.env.REACT_APP_GRAPHQL_URI || "http://localhost:3001/graphql",
        LOGIN_USER,
        {
          email: loginData.email,
          password: loginData.password,
        }
      );
      const { token, user } = response.login;
      localStorage.setItem("token", token);
      console.log("User logged in successfully:", user);
      return user;
    } catch (error) {
      console.error("Error logging in:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Create the async thunk for Google Sign-In
export const googleSignIn = createAsyncThunk(
  "auth/googleSignIn",
  async (googleData, thunkAPI) => {
    try {
      console.log("Google Sign-In initiated with data:", googleData);
      const response = await request(
        process.env.REACT_APP_GRAPHQL_URI || "http://localhost:3001/graphql",
        GOOGLE_SIGN_IN,
        {
          input: googleData,
        }
      );
      const { token, user } = response.googleSignIn;
      localStorage.setItem("token", token);
      console.log("Google Sign-In successful:", user);
      return user;
    } catch (error) {
      console.error("Error with Google Sign-In:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Define the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem("token");
      console.log("User logged out");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        console.log("loginUser.pending");
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        console.log("loginUser.fulfilled:", action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        console.log("loginUser.rejected:", state.error);
      })
      .addCase(googleSignIn.pending, (state) => {
        state.loading = true;
        console.log("googleSignIn.pending");
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        console.log("googleSignIn.fulfilled:", action.payload);
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        console.log("googleSignIn.rejected:", state.error);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
