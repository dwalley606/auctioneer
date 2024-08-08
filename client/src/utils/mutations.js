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
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
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

export const PLACE_BID = gql`
  mutation PlaceBid($productId: ID!, $amount: Float!) {
    placeBid(productId: $productId, amount: $amount) {
      id
      user {
        id
        username
      }
      product {
        id
        name
      }
      amount
      timestamp
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($productId: ID!, $amount: Float!) {
    createOrder(productId: $productId, amount: $amount) {
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

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) {
      id
      name
      products {
        id
        name
      }
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($categoryId: ID!, $name: String!) {
    updateCategory(categoryId: $categoryId, name: $name) {
      id
      name
    }
  }
`;

export const CREATE_FEEDBACK = gql`
  mutation CreateFeedback($productId: ID!, $rating: Int!, $comment: String!) {
    createFeedback(productId: $productId, rating: $rating, comment: $comment) {
      id
      user {
        id
        username
      }
      product {
        id
        name
      }
      rating
      comment
    }
  }
`;

export const CREATE_PAYMENT = gql`
  mutation CreatePayment($orderId: ID!, $method: String!) {
    createPayment(orderId: $orderId, method: $method) {
      id
      order {
        id
      }
      method
      status
      transactionId
    }
  }
`;

export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($userId: ID!, $message: String!) {
    createNotification(userId: $userId, message: $message) {
      id
      user {
        id
        username
      }
      message
      read
      timestamp
    }
  }
`;

export const CREATE_AUCTION = gql`
  mutation CreateAuction(
    $productId: ID!
    $startTime: String!
    $endTime: String!
    $startingPrice: Float!
  ) {
    createAuction(
      productId: $productId
      startTime: $startTime
      endTime: $endTime
      startingPrice: $startingPrice
    ) {
      id
      product {
        id
        name
      }
      startTime
      endTime
      startingPrice
      bids {
        id
        amount
      }
      status
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

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      username
      email
      photoUrl
    }
  }
`;
