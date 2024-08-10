import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import {
  GET_PRODUCTS,
  GET_PRODUCT_DETAILS,
  GET_USER_PROFILE,
  GET_AUCTIONS,
  GET_USER_AUCTIONS,
  GET_CATEGORIES,
} from "./queries";
import {
  LOGIN_USER,
  SIGNUP_USER,
  CREATE_PRODUCT,
  PLACE_BID,
  CREATE_ORDER,
  GOOGLE_SIGN_IN,
  UPDATE_USER_PROFILE,
  CREATE_AUCTION,
  CREATE_FEEDBACK,
} from "./mutations";
import { getAuthHeaders } from "./auth";

// Fetch all products
export const useGetProducts = () => {
  return useQuery(GET_PRODUCTS, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("Fetched products:", data),
    onError: (error) => console.error("Error fetching products:", error),
  });
};

// Create an auction
export const useCreateAuction = () => {
  return useMutation(CREATE_AUCTION, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("Auction created:", data),
    onError: (error) => {
      console.error("Error creating auction:", error);
      console.log("Auth headers:", getAuthHeaders());
    },
  });
};

// Fetch product details
export const useGetProductDetails = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [
    getProductDetails,
    { data, loading: queryLoading, error: queryError, refetch },
  ] = useLazyQuery(GET_PRODUCT_DETAILS, {
    variables: { id },
    context: {
      headers: getAuthHeaders(),
    },
  });

  useEffect(() => {
    if (id) {
      getProductDetails();
    }
  }, [id, getProductDetails]);

  useEffect(() => {
    if (data && data.product) {
      setProduct(data.product);
      setLoading(false);
      setError(null);
    } else if (queryError) {
      setError(queryError);
      setLoading(false);
    }
  }, [data, queryError]);

  return {
    product,
    loading: queryLoading || loading,
    error: queryError || error,
    refetch,
  };
};

// Fetch user profile
export const useGetUserProfile = () => {
  return useQuery(GET_USER_PROFILE, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("Fetched user profile:", data),
    onError: (error) => console.error("Error fetching user profile:", error),
  });
};

// Fetch all auctions
export const useGetAuctions = () => {
  return useQuery(GET_AUCTIONS, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("Fetched auctions:", data),
    onError: (error) => console.error("Error fetching auctions:", error),
  });
};

// Fetch user-specific auctions
export const useGetUserAuctions = () => {
  return useQuery(GET_USER_AUCTIONS, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("Fetched user auctions:", data),
    onError: (error) => console.error("Error fetching user auctions:", error),
  });
};

// Fetch all categories
export const useGetCategories = () => {
  return useQuery(GET_CATEGORIES, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("Fetched categories:", data),
    onError: (error) => console.error("Error fetching categories:", error),
  });
};

// User login
export const useLoginUser = () => {
  return useMutation(LOGIN_USER, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("User logged in:", data),
    onError: (error) => console.error("Error logging in user:", error),
  });
};

// User signup
export const useSignupUser = () => {
  return useMutation(SIGNUP_USER, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("User signed up:", data),
    onError: (error) => console.error("Error signing up user:", error),
  });
};

// Create a new product
export const useCreateProduct = () => {
  return useMutation(CREATE_PRODUCT, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("Product created:", data),
    onError: (error) => console.error("Error creating product:", error),
  });
};

// Place a bid on a product
export const usePlaceBid = () => {
  return useMutation(PLACE_BID, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("Bid placed:", data),
    onError: (error) => console.error("Error placing bid:", error),
  });
};

// Create a new order
export const useCreateOrder = () => {
  return useMutation(CREATE_ORDER, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("Order created:", data),
    onError: (error) => console.error("Error creating order:", error),
  });
};

// Google sign-in
export const useGoogleSignIn = () => {
  return useMutation(GOOGLE_SIGN_IN, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("Google sign-in successful:", data),
    onError: (error) => console.error("Error with Google sign-in:", error),
  });
};

// Update user profile
export const useUpdateUserProfile = () => {
  return useMutation(UPDATE_USER_PROFILE, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("User profile updated:", data),
    onError: (error) => console.error("Error updating user profile:", error),
  });
};

// Create feedback for a product
export const useCreateFeedback = () => {
  return useMutation(CREATE_FEEDBACK, {
    context: {
      headers: getAuthHeaders(),
    },
    onCompleted: (data) => console.log("Feedback created:", data),
    onError: (error) => {
      console.error("Error creating feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    },
  });
};
