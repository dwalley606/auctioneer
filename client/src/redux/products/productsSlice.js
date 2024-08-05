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
      user {
        id
        username
      }
    }
  }
`;

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const userId = state.auth.user.id; // Assuming you store user info in auth slice

      const formData = new FormData();
      formData.append(
        "operations",
        JSON.stringify({
          query: `
          mutation CreateProduct($name: String!, $description: String!, $price: Float!, $quantity: Int!, $categoryId: ID!, $image: Upload!, $userId: ID!) {
            createProduct(name: $name, description: $description, price: $price, quantity: $quantity, categoryId: $categoryId, image: $image, userId: $userId) {
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
              user {
                id
                username
              }
            }
          }
        `,
          variables: {
            name: productData.name,
            description: productData.description,
            price: parseFloat(productData.price),
            quantity: parseInt(productData.quantity, 10),
            categoryId: productData.category,
            image: null,
            userId: userId,
          },
        })
      );
      formData.append("map", JSON.stringify({ 1: ["variables.image"] }));
      formData.append("1", productData.image);

      const response = await fetch("http://localhost:3001/graphql", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      return result.data.createProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    console.log("Fetching products from server...");
    const response = await request(
      "http://localhost:3001/graphql",
      GET_PRODUCTS
    );
    console.log("Products fetched:", response.products);
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
