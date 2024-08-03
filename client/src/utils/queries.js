import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
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
      seller {
        id
        username
      }
      auction {
        id
        startTime
        endTime
        status
      }
    }
  }
`;

export const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($id: ID!) {
    product(id: $id) {
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
      seller {
        id
        username
      }
      auction {
        id
        startTime
        endTime
        status
      }
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    userProfile {
      id
      username
      email
      photoUrl
      products {
        id
        name
      }
      orders {
        id
        product {
          name
        }
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      email
      products {
        id
        name
      }
      bids {
        id
        amount
      }
      orders {
        id
        amount
      }
      feedbacks {
        id
        rating
      }
      wishlist {
        id
        name
      }
      notifications {
        id
        message
        read
        timestamp
      }
    }
  }
`;

export const GET_AUCTIONS = gql`
  query GetAuctions {
    auctions {
      id
      product {
        id
        name
      }
      startTime
      endTime
      startingPrice
      bids {
        amount
        user {
          id
          username
        }
      }
      status
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      buyer {
        id
        username
      }
      product {
        id
        name
      }
      amount
      payment {
        id
        method
        status
        transactionId
      }
    }
  }
`;

export const GET_PAYMENTS = gql`
  query GetPayments {
    payments {
      id
      order {
        id
        amount
      }
      method
      status
      transactionId
    }
  }
`;

export const GOOGLE_SIGN_IN = gql`
  mutation GoogleSignIn($input: GoogleSignInInput!) {
    googleSignIn(input: $input) {
      token
      user {
        id
        username
        email
        photoUrl
      }
    }
  }
`;

export const QUERY_CHECKOUT = gql`
  query getCheckout($products: [ProductInput]) {
    checkout(products: $products) {
      session
    }
  }
`;
