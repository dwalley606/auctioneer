const { User, Product, Category, Order } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const actions = require("./actions");

const resolvers = {
  Query: {
    users: async (_, __, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return await actions.getUsers();
    },
    products: async () => {
      try {
        const products = await actions.getProducts();
        console.log("GraphQL Resolver - Products fetched: ", products);
        return products;
      } catch (error) {
        console.error("GraphQL Resolver - Error fetching products: ", error);
        throw new Error("Error fetching products");
      }
    },
    categories: async () => {
      try {
        const categories = await actions.getCategories();
        console.log("GraphQL Resolver - Categories fetched: ", categories);
        return categories;
      } catch (error) {
        console.error("GraphQL Resolver - Error fetching categories: ", error);
        throw new Error("Error fetching categories");
      }
    },
    orders: async (_, __, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
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
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return await actions.getPayments();
    },
    notifications: async (_, __, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return await actions.getNotifications();
    },
  },
  Mutation: {
    signup: async (_, { username, email, password }) => {
      return await actions.signup(username, email, password);
    },
    login: async (_, { email, password }) => {
      try {
        return await actions.login(email, password);
      } catch (error) {
        console.error("GraphQL Login Error:", error);
        throw new AuthenticationError("Invalid credentials");
      }
    },
    googleSignIn: async (parent, { input }) => {
      return await actions.googleSignIn(parent, { input });
    },
    createUser: async (_, { username, email, password }, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return await actions.createUser(username, email, password);
    },
    createProduct: async (
      _,
      { name, description, quantity, price, categoryId },
      context
    ) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return await actions.createProduct(
        name,
        description,
        quantity,
        price,
        categoryId,
        context.user.id
      );
    },
    createCategory: async (_, { name }, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return await actions.createCategory(name);
    },
    createOrder: async (_, { productId, amount }, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return await actions.createOrder(context.user.id, productId, amount);
    },
    createFeedback: async (_, { productId, rating, comment }, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
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
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return await actions.createAuction(
        productId,
        startTime,
        endTime,
        startingPrice,
        status
      );
    },
    placeBid: async (_, { productId, amount }, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return await actions.placeBid(context.user.id, productId, amount);
    },
    createPayment: async (
      _,
      { orderId, method, status, transactionId },
      context
    ) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return await actions.createPayment(
        orderId,
        method,
        status,
        transactionId
      );
    },
    createNotification: async (_, { userId, message }, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return await actions.createNotification(userId, message);
    },
  },
};

module.exports = resolvers;
