import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../App"; // Import the client from App.jsx
import { GET_CATEGORIES } from "../../utils/queries";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    console.log("Fetching categories from server...");
    const { data } = await client.query({ query: GET_CATEGORIES });
    console.log("Categories fetched:", data.categories);
    return data.categories;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentCategory: null,
  },
  reducers: {
    setCurrentCategory(state, action) {
      console.log("Setting current category:", action.payload);
      state.currentCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        console.log("Fetching categories pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        console.log("Fetching categories fulfilled:", action.payload);
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        console.error("Fetching categories rejected:", action.error.message);
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentCategory } = categoriesSlice.actions;

export default categoriesSlice.reducer;
