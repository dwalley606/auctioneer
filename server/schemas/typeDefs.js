const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Upload

  type User {
    id: ID!
    username: String!
    email: String!
    products: [Product]
    bids: [Bid]
    orders: [Order]
    feedbacks: [Feedback]
    wishlist: [Product]
    notifications: [Notification]
    photoUrl: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input UpdateUserProfileInput {
    username: String
    email: String
    photoUrl: String
    password: String
    profilePicture: String
  }

  input GoogleSignInInput {
    idToken: String!
    email: String!
    username: String!
    photoUrl: String
    googleId: String!
  }

  input CreateProductInput {
    name: String!
    description: String!
    quantity: Int!
    price: Float!
    categoryId: ID!
    subcategoryId: ID!
    image: String!
    sellerId: ID!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    image: String
    quantity: Int!
    price: Float!
    category: Category!
    subcategory: Subcategory
    seller: User!
    bids: [Bid]
    feedbacks: [Feedback]
    auction: Auction
  }

  type Category {
    id: ID!
    name: String!
    subcategories: [Subcategory]
  }

  type Subcategory {
    id: ID!
    name: String!
  }

  type Order {
    id: ID!
    buyer: User!
    product: Product!
    amount: Float!
    payment: Payment!
  }

  type Feedback {
    id: ID!
    rating: Int!
    comment: String
    fromUser: User!
    toUser: User!
    product: Product!
    createdAt: String!
  }

  extend type Query {
    feedbacksByProduct(productId: ID!): [Feedback!]!
  }

  extend type Mutation {
    createFeedback(productId: ID!, rating: Int!, comment: String): Feedback!
  }

  type Auction {
    id: ID!
    product: Product!
    startTime: String!
    endTime: String!
    startingPrice: Float!
    highestBid: Float
    highestBidUser: User
    bids: [Bid!]!
    status: String!
  }

  type Bid {
    id: ID!
    user: User!
    product: Product!
    amount: Float!
    timestamp: String!
  }

  type Payment {
    id: ID!
    order: Order!
    method: String!
    status: String!
    transactionId: String!
  }

  type Notification {
    id: ID!
    user: User!
    message: String!
    read: Boolean!
    timestamp: String!
  }

  type Query {
    users: [User]
    products: [Product]
    product(id: ID!): Product
    categories: [Category]
    category(id: ID!): Category
    orders: [Order]
    feedbacks: [Feedback]
    auctions: [Auction]
    bids: [Bid]
    payments: [Payment]
    notifications: [Notification]
    userProfile: User
    userAuctions: [Auction!]!
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    googleSignIn(input: GoogleSignInInput!): AuthPayload
    createProduct(input: CreateProductInput!): Product
    createCategory(name: String!): Category
    createOrder(productId: ID!, amount: Float!): Order
    createFeedback(productId: ID!, rating: Int!, comment: String!): Feedback
    createAuction(
      productId: ID!
      startTime: String!
      endTime: String!
      startingPrice: Float!
      status: String!
    ): Auction!
    placeBid(productId: ID!, amount: Float!): Bid
    createPayment(
      orderId: ID!
      method: String!
      status: String!
      transactionId: String!
    ): Payment
    createNotification(userId: ID!, message: String!): Notification
    updateUserProfile(input: UpdateUserProfileInput!): User
    deleteProduct(id: ID!): Product
  }
`;

module.exports = typeDefs;
