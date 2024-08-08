import { useQuery, useMutation } from "@apollo/client";
import {
  GET_PRODUCTS,
  GET_PRODUCT_DETAILS,
  GET_USER_PROFILE,
  // GET_USERS,
  // GET_ORDERS,
  // GET_PAYMENTS,
  GET_AUCTIONS,
  GET_CATEGORIES,
} from "./queries";
import {
  LOGIN_USER,
  SIGNUP_USER,
  CREATE_PRODUCT,
  // CREATE_BID,
  CREATE_ORDER,
  // CREATE_CATEGORY,
  // UPDATE_CATEGORY,
  // CREATE_FEEDBACK,
  // CREATE_PAYMENT,
  // CREATE_NOTIFICATION,
  // CREATE_AUCTION,
  GOOGLE_SIGN_IN,
  UPDATE_USER_PROFILE,
  CREATE_AUCTION,
} from "./mutations";
import { getAuthHeaders } from "./auth";

export const useGetProducts = () => {
  return useQuery(GET_PRODUCTS, {
    onCompleted: (data) => console.log("Fetched products:", data),
    onError: (error) => console.error("Error fetching products:", error),
  });
};

export const useCreateAuction = () => {
  return useMutation(CREATE_AUCTION, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("Auction created:", data),
    onError: (error) => console.error("Error creating auction:", error),
  });
};

export const useGetProductDetails = (id) => {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCT_DETAILS, {
    variables: { id },
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => {
      console.log("Fetched product details:", data);
      if (!data || !data.product) {
        console.error("Product not found in the response");
      }
    },
    onError: (error) => {
      console.error("Error fetching product details:", error);
    },
  });

  const product = data?.product;
  return { product, loading, error, refetch };
};

export const useGetUserProfile = () => {
  return useQuery(GET_USER_PROFILE, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("Fetched user profile:", data),
    onError: (error) => console.error("Error fetching user profile:", error),
  });
};

export const useGetAuctions = () => {
  const { data, loading, error, startPolling, stopPolling } = useQuery(
    GET_AUCTIONS,
    {
      context: {
        headers: getAuthHeaders(),
      },
    }
  );
  return { data, loading, error, startPolling, stopPolling };
};

export const useGetCategories = () => {
  return useQuery(GET_CATEGORIES, {
    onCompleted: (data) => console.log("Fetched categories:", data),
    onError: (error) => console.error("Error fetching categories:", error),
  });
};

export const useLoginUser = () => {
  return useMutation(LOGIN_USER, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("User logged in:", data),
    onError: (error) => console.error("Error logging in user:", error),
  });
};

export const useSignupUser = () => {
  return useMutation(SIGNUP_USER, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("User signed up:", data),
    onError: (error) => console.error("Error signing up user:", error),
  });
};

export const useCreateProduct = () => {
  return useMutation(CREATE_PRODUCT, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("Product created:", data),
    onError: (error) => console.error("Error creating product:", error),
  });
};

export const usePlaceBid = () => {
  return useMutation(PLACE_BID, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("Bid placed:", data),
    onError: (error) => console.error("Error placing bid:", error),
  });
};

export const useCreateOrder = () => {
  return useMutation(CREATE_ORDER, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("Order created:", data),
    onError: (error) => console.error("Error creating order:", error),
  });
};

export const useGoogleSignIn = () => {
  return useMutation(GOOGLE_SIGN_IN, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("Google sign-in successful:", data),
    onError: (error) => console.error("Error with Google sign-in:", error),
  });
};

export const useUpdateUserProfile = () => {
  return useMutation(UPDATE_USER_PROFILE, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("User profile updated:", data),
    onError: (error) => console.error("Error updating user profile:", error),
  });
};
