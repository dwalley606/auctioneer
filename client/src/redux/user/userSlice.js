import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      console.log("Sign in started");
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      console.log("Sign in success", action.payload);
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      console.log("Sign in failure", action.payload);
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      console.log("Update started");
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      console.log("Update success", action.payload);
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      console.log("Update failure", action.payload);
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      console.log("Delete user started");
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      console.log("Delete user success");
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      console.log("Delete user failure", action.payload);
      state.loading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      console.log("Sign out success");
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} = userSlice.actions;

export default userSlice.reducer;
