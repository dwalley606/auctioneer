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

export const GET_AUCTIONS = gql`
  query GetAuctions {
    auctions {
      id
      product {
        id
        name
        description
        image
      }
      startTime
      endTime
      startingPrice
      highestBid
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

export const GET_USER_AUCTIONS = gql`
  query GetUserAuctions {
    userAuctions {
      id
      product {
        id
        name
        image
        description
      }
      startTime
      endTime
      startingPrice
      highestBid
      highestBidUser {
        id
        username
      }
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
      subcategories {
        id
        name
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

export const GET_FEEDBACKS_BY_PRODUCT = gql`
  query FeedbacksByProduct($productId: ID!) {
    feedbacksByProduct(productId: $productId) {
      id
      rating
      comment
      fromUser {
        id
        username
      }
      createdAt
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categoryId: ID!, $subcategoryId: ID) {
    productsByCategory(categoryId: $categoryId, subcategoryId: $subcategoryId) {
      id
      name
      description
      price
      image
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
