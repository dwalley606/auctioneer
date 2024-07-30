import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
      category {
        id
        name
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
      price
      category {
        id
        name
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
        name
      }
      startTime
      endTime
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
