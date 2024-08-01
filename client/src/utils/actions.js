import { useQuery, useMutation } from "@apollo/client";
import {
  GET_PRODUCTS,
  GET_PRODUCT_DETAILS,
  GET_USER_PROFILE,
  GET_USERS,
  GET_ORDERS,
  GET_PAYMENTS,
  GET_AUCTIONS,
  GET_CATEGORIES,
} from "./queries";
import {
  LOGIN_USER,
  SIGNUP_USER,
  CREATE_PRODUCT,
  CREATE_BID,
  CREATE_ORDER,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  CREATE_FEEDBACK,
  CREATE_PAYMENT,
  CREATE_NOTIFICATION,
  CREATE_AUCTION,
  GOOGLE_SIGN_IN,
} from "./mutations";

export const useGetProducts = () => {
  return useQuery(GET_PRODUCTS);
};

export const useGetProductDetails = (id) => {
  return useQuery(GET_PRODUCT_DETAILS, {
    variables: { id },
  });
};

export const useGetUserProfile = () => {
  return useQuery(GET_USER_PROFILE);
};

export const useGetAuctions = () => {
  return useQuery(GET_AUCTIONS);
};

export const useGetCategories = () => {
  return useQuery(GET_CATEGORIES);
};

export const useGetUsers = () => {
  return useQuery(GET_USERS);
};

export const useGetOrders = () => {
  return useQuery(GET_ORDERS);
};

export const useGetPayments = () => {
  return useQuery(GET_PAYMENTS);
};

export const useLoginUser = () => {
  return useMutation(LOGIN_USER);
};

export const useSignupUser = () => {
  return useMutation(SIGNUP_USER);
};

export const useCreateProduct = () => {
  return useMutation(CREATE_PRODUCT);
};

export const useCreateOrder = () => {
  return useMutation(CREATE_ORDER);
};

export const useUpdateCategory = () => {
  return useMutation(UPDATE_CATEGORY);
};

export const useCreateBid = () => {
  return useMutation(CREATE_BID);
};

export const useCreateCategory = () => {
  return useMutation(CREATE_CATEGORY);
};

export const useCreateFeedback = () => {
  return useMutation(CREATE_FEEDBACK);
};

export const useCreatePayment = () => {
  return useMutation(CREATE_PAYMENT);
};

export const useCreateNotification = () => {
  return useMutation(CREATE_NOTIFICATION);
};

export const useCreateAuction = () => {
  return useMutation(CREATE_AUCTION);
};

export const useGoogleSignIn = () => {
  return useMutation(GOOGLE_SIGN_IN);
};

export const UPDATE_PRODUCTS = "UPDATE_PRODUCTS";

export const ADD_TO_CART = "ADD_TO_CART";
export const ADD_MULTIPLE_TO_CART = "ADD_MULTIPLE_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const CLEAR_CART = "CLEAR_CART";
export const UPDATE_CART_QUANTITY = "UPDATE_CART_QUANTITY";
export const TOGGLE_CART = "TOGGLE_CART";

export const UPDATE_CATEGORIES = "UPDATE_CATEGORIES";
export const UPDATE_CURRENT_CATEGORY = "UPDATE_CURRENT_CATEGORY";
