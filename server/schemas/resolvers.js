const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");
const actions = require("./actions");

const resolvers = {
  Query: {
    users: async (_, __, context) => {
      if (!context.user) throw AuthenticationError;
      return await actions.getUsers();
    },
    products: async () => {
      return await actions.getProducts();
    },
    categories: async () => {
      return await actions.getCategories();
    },
    orders: async (_, __, context) => {
      if (!context.user) throw AuthenticationError;
      return await actions.getOrders();
    },
    feedbacks: async () => {
      return await actions.getFeedbacks();
    },
    auctions: async () => {
      return await actions.getAuctions();
    },
    bids: async () => {
      return await actions.getBids();
    },
    payments: async (_, __, context) => {
      if (!context.user) throw AuthenticationError;
      return await actions.getPayments();
    },
    notifications: async (_, __, context) => {
      if (!context.user) throw AuthenticationError;
      return await actions.getNotifications();
    },
  },
  Mutation: {
    signup: async (_, { username, email, password }) => {
      return await actions.signup(username, email, password);
    },
    login: async (_, { email, password }) => {
      return await actions.login(email, password);
    },
    googleSignIn: async (parent, { input }) => {
      try {
        // Verify the Google ID token here (you should implement this)
        // const decodedToken = await verifyGoogleIdToken(input.idToken);
        // if (!decodedToken) {
        //   throw new AuthenticationError('Invalid Google ID token');
        // }

        let user = await User.findOne({ email: input.email });

        if (!user) {
          // If the user doesn't exist, create a new one
          user = await User.create({
            username: input.username,
            email: input.email,
            googleId: input.googleId,
            photoUrl: input.photoUrl,
          });
        } else if (!user.googleId) {
          // If user exists but doesn't have a googleId, update it
          user.googleId = input.googleId;
          user.photoUrl = input.photoUrl;
          await user.save();
        }

        const token = signToken(user);
        return { token, user };
      } catch (error) {
        console.error("Google sign-in error:", error);
        throw new AuthenticationError("Unable to authenticate with Google");
      }
    },

    createUser: async (_, { username, email, password }, context) => {
      if (!context.user) throw AuthenticationError;
      return await actions.createUser(username, email, password);
    },
    createProduct: async (
      _,
      { name, description, startingPrice, categoryId },
      context
    ) => {
      if (!context.user) throw AuthenticationError;
      return await actions.createProduct(
        name,
        description,
        startingPrice,
        categoryId,
        context.user.id
      );
    },
    createCategory: async (_, { name }, context) => {
      if (!context.user) throw AuthenticationError;
      return await actions.createCategory(name);
    },
    createOrder: async (_, { productId, amount }, context) => {
      if (!context.user) throw AuthenticationError;
      return await actions.createOrder(context.user.id, productId, amount);
    },
    createFeedback: async (_, { productId, rating, comment }, context) => {
      if (!context.user) throw AuthenticationError;
      return await actions.createFeedback(
        context.user.id,
        productId,
        rating,
        comment
      );
    },
    createAuction: async (
      _,
      { productId, startTime, endTime, startingPrice, status },
      context
    ) => {
      if (!context.user) throw AuthenticationError;
      return await actions.createAuction(
        productId,
        startTime,
        endTime,
        startingPrice,
        status
      );
    },
    createBid: async (_, { productId, amount }, context) => {
      if (!context.user) throw AuthenticationError;
      return await actions.createBid(context.user.id, productId, amount);
    },
    createPayment: async (
      _,
      { orderId, method, status, transactionId },
      context
    ) => {
      if (!context.user) throw AuthenticationError;
      return await actions.createPayment(
        orderId,
        method,
        status,
        transactionId
      );
    },
    createNotification: async (_, { userId, message }, context) => {
      if (!context.user) throw AuthenticationError;
      return await actions.createNotification(userId, message);
    },
  },
};

module.exports = resolvers;
