// client/src/actions.js

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
