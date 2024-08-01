const { gql } = require("apollo-server-express");

const typeDefs = gql`
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

  input GoogleSignInInput {
    idToken: String!
    email: String!
    username: String!
    photoUrl: String
    googleId: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    startingPrice: Float!
    category: Category!
    seller: User!
    bids: [Bid]
    feedbacks: [Feedback]
    auction: Auction!
  }

  type Category {
    id: ID!
    name: String!
    products: [Product]
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
    user: User!
    product: Product!
    rating: Int!
    comment: String!
  }

  type Auction {
    id: ID!
    product: Product!
    startTime: String!
    endTime: String!
    startingPrice: Float!
    bids: [Bid]
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
    orders: [Order]
    feedbacks: [Feedback]
    auctions: [Auction]
    bids: [Bid]
    payments: [Payment]
    notifications: [Notification]
    userProfile: User
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    googleSignIn(input: GoogleSignInInput!): AuthPayload
    createUser(username: String!, email: String!, password: String!): User
    createProduct(
      name: String!
      description: String!
      startingPrice: Float!
      categoryId: ID!
    ): Product
    createCategory(name: String!): Category
    createBid(productId: ID!, amount: Float!): Bid
    createOrder(productId: ID!, amount: Float!): Order
    createFeedback(productId: ID!, rating: Int!, comment: String!): Feedback
    createPayment(
      orderId: ID!
      method: String!
      status: String!
      transactionId: String!
    ): Payment
    createNotification(userId: ID!, message: String!): Notification
    createAuction(
      productId: ID!
      startTime: String!
      endTime: String!
      startingPrice: Float!
      status: String!
    ): Auction
  }
`;

module.exports = typeDefs;
