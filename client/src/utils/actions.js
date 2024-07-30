// client/src/actions.js

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_PRODUCTS,
  GET_PRODUCT_DETAILS,
  GET_USER_PROFILE,
  GET_AUCTIONS,
  GET_CATEGORIES,
} from "./queries";
import {
  LOGIN_USER,
  SIGNUP_USER,
  CREATE_PRODUCT,
  PLACE_BID,
  CREATE_ORDER,
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

export const useLoginUser = () => {
  return useMutation(LOGIN_USER);
};

export const useSignupUser = () => {
  return useMutation(SIGNUP_USER);
};

export const useCreateProduct = () => {
  return useMutation(CREATE_PRODUCT);
};

export const usePlaceBid = () => {
  return useMutation(PLACE_BID);
};

export const useCreateOrder = () => {
  return useMutation(CREATE_ORDER);
};
