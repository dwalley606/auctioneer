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
      subcategory {
        id
        name
      }
      seller {
        id
        username
      }
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      image
      quantity
      price
      category {
        id
        name
      }
      subcategory {
        id
        name
      }
      seller {
        id
        username
      }
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const { data } = await client.query({
        query: GET_PRODUCTS,
        context: {
          headers: getAuthHeaders(),
        },
      });
      return data.products;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const input = {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        quantity: parseInt(productData.quantity, 10),
        categoryId: productData.categoryId,
        subcategoryId: productData.subcategoryId,
        image: productData.image,
        sellerId: productData.sellerId,
      };

      console.log("Sending product data:", JSON.stringify(input, null, 2));

      const response = await client.mutate({
        mutation: CREATE_PRODUCT,
        variables: { input },
      });

      console.log("Server response:", JSON.stringify(response, null, 2));
      return response.data.createProduct;
    } catch (error) {
      console.error("Error in createProduct thunk:", error);
      if (error.graphQLErrors) {
        console.error(
          "GraphQL errors:",
          JSON.stringify(error.graphQLErrors, null, 2)
        );
      }
      if (error.networkError) {
        console.error("Network error:", error.networkError);
      }
      return rejectWithValue(
        error.message || "An error occurred while creating the product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await client.mutate({
        mutation: DELETE_PRODUCT,
        variables: { id },
        context: {
          headers: getAuthHeaders(),
        },
      });
      return id;
    } catch (error) {
      console.error("Error in deleteProduct thunk:", error);
      return rejectWithValue(
        error.message || "An error occurred while deleting the product"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const input = {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        quantity: parseInt(productData.quantity, 10),
        categoryId: productData.categoryId,
        subcategoryId: productData.subcategoryId,
        image: productData.image,
      };

      const response = await client.mutate({
        mutation: UPDATE_PRODUCT,
        variables: { id, input },
        context: {
          headers: getAuthHeaders(),
        },
      });

      return response.data.updateProduct;
    } catch (error) {
      console.error("Error in updateProduct thunk:", error);
      return rejectWithValue(
        error.message || "An error occurred while updating the product"
      );
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
