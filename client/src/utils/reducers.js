import {
  useGetProducts,
  useGetProductDetails,
  useGetUserProfile,
  useGetAuctions,
  useGetCategories,
  useLoginUser,
  useSignupUser,
  useCreateProduct,
  useCreateOrder,
  useUpdateCategory,
} from "./actions";

export const reducer = (state, action) => {
  switch (action.type) {
    case "GET_PRODUCTS":
      return {
        ...state,
        products: useGetProducts(),
      };

    case "GET_PRODUCT_DETAILS":
      return {
        ...state,
        productDetails: useGetProductDetails(action.id),
      };

    case "GET_USER_PROFILE":
      return {
        ...state,
        userProfile: useGetUserProfile(),
      };

    case "GET_USERS":
      return {
        ...state,
        users: useGetUsers(),
      };

    case "GET_ORDERS":
      return {
        ...state,
        orders: useGetOrders(),
      };

    case "GET_PAYMENTS":
      return {
        ...state,
        payments: useGetPayments(),
      };

    case "GET_AUCTIONS":
      return {
        ...state,
        auctions: useGetAuctions(),
      };

    case "GET_CATEGORIES":
      return {
        ...state,
        categories: useGetCategories(),
      };

    case "LOGIN_USER":
      return {
        ...state,
        user: useLoginUser(),
      };

    case "SIGNUP_USER":
      return {
        ...state,
        newUser: useSignupUser(),
      };

    case "CREATE_PRODUCT":
      return {
        ...state,
        newProduct: useCreateProduct(),
      };

    case "CREATE_BID":
      return {
        ...state,
        bidResult: useCreateBid(),
      };

    case "CREATE_ORDER":
      return {
        ...state,
        orderResult: useCreateOrder(),
      };

    case "CREATE_CATEGORY":
      return {
        ...state,
        categoryResult: useCreateCategory(),
      };

    case "UPDATE_CATEGORY":
      return {
        ...state,
        categoryUpdateResult: useUpdateCategory(),
      };

    case "CREATE_FEEDBACK":
      return {
        ...state,
        feedbackResult: useCreateFeedback(),
      };

    case "CREATE_PAYMENT":
      return {
        ...state,
        paymentResult: useCreatePayment(),
      };

    case "CREATE_NOTIFICATION":
      return {
        ...state,
        notificationResult: useCreateNotification(),
      };

    case "CREATE_AUCTION":
      return {
        ...state,
        auctionResult: useCreateAuction(),
      };
    default:
      return state;
  }
};
