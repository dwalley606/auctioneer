import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation SignupUser($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($name: String!, $description: String!, $price: Float!, $categoryId: ID!) {
    createProduct(name: $name, description: $description, price: $price, categoryId: $categoryId) {
      id
      name
      description
      price
      category {
        id
        name
      }
    }
  }
`;

export const PLACE_BID = gql`
  mutation PlaceBid($productId: ID!, $amount: Float!) {
    placeBid(productId: $productId, amount: $amount) {
      id
      user {
        id
        username
      }
      amount
      timestamp
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($productId: ID!) {
    createOrder(productId: $productId) {
      id
      product {
        id
        name
      }
      amount
      payment {
        id
        method
        status
      }
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