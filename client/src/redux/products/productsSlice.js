import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { gql } from "@apollo/client";
import { client } from "../../App";
import { getAuthHeaders } from "../../utils/auth";

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

const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $description: String!
    $price: Float!
    $quantity: Int!
    $categoryId: ID!
    $image: String!
    $userId: ID!
  ) {
    createProduct(
      name: $name
      description: $description
      price: $price
      quantity: $quantity
      categoryId: $categoryId
      image: $image
      userId: $userId
    ) {
      id
      name
      description
      price
      quantity
      category {
        id
        name
      }
      image
    }
  }
`;

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, thunkAPI) => {
    const state = thunkAPI.getState();
    const userId = state.user.currentUser.id;

    if (!userId) {
      console.error("User not authenticated");
      return thunkAPI.rejectWithValue("User not authenticated");
    }

    const headers = getAuthHeaders();

    try {
      const response = await client.mutate({
        mutation: CREATE_PRODUCT,
        variables: {
          ...productData,
          userId: String(userId),
          categoryId: String(productData.categoryId),
        },
        context: {
          headers: {
            ...headers,
          },
        },
      });

      console.log(
        "Product created successfully: ",
        response.data.createProduct
      );
      return response.data.createProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    try {
      const response = await client.query({
        query: GET_PRODUCTS,
      });
      console.log("Fetched products: ", response.data.products);
      return response.data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
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
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;
