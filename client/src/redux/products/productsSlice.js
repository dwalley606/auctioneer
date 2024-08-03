import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { gql, request } from "graphql-request";

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      image
      price
      quantity
      category {
        id
        name
      }
    }
  }
`;

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    console.log("Fetching products from server...");
    const response = await request(
      "http://localhost:3001/graphql",
      GET_PRODUCTS
    );
    // console.log("Products fetched:", response.products);
    return response.products;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        console.log("Fetching products pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        console.log("Fetching products fulfilled:", action.payload);
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.error("Fetching products rejected:", action.error.message);
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;
