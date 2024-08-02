import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { gql } from "@apollo/client";
import client from "../../utils/apolloClient"; // Import the Apollo Client instance

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const { data } = await client.query({
      query: gql`
        query GetProducts {
          products {
            id
            name
            description
            image
            price
          }
        }
      `,
    });
    console.log("Products fetched: ", data.products);
    return data.products;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      console.log("Products slice updated with: ", action.payload);
      return action.payload;
    });
  },
});

export const selectProducts = (state) => state.products;

export default productsSlice.reducer;
