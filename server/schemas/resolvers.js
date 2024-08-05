const { AuthenticationError } = require("apollo-server-express");
const actions = require("./actions");
const { Auction, Product, Category, User } = require("../models");

const resolvers = {
  Upload: require("graphql-upload").GraphQLUpload,
  Query: {
    users: async (_, __, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      console.log("Fetching users for authenticated user:", context.user);
      return actions.getUsers();
    },
    products: async () => {
      console.log("Fetching all products...");
      return actions.getProducts();
    },
    categories: async () => {
      console.log("Fetching all categories...");
      return actions.getCategories();
    },
    category: async (_, { id }) => {
      console.log("Fetching category with ID:", id);
      return actions.getCategoryById(id);
    },
    orders: async (_, __, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      console.log("Fetching orders for authenticated user:", context.user);
      return actions.getOrders();
    },
    feedbacks: async () => {
      console.log("Fetching all feedbacks...");
      return actions.getFeedbacks();
    },
    auctions: async () => {
      console.log("Fetching all auctions...");
      return Auction.find().populate("product");
    },
    bids: async () => {
      console.log("Fetching all bids...");
      return actions.getBids();
    },
    payments: async (_, __, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      console.log("Fetching payments for authenticated user:", context.user);
      return actions.getPayments();
    },
    notifications: async (_, __, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      console.log(
        "Fetching notifications for authenticated user:",
        context.user
      );
      return actions.getNotifications();
    },
    product: async (_, { id }) => {
      try {
        console.log("Fetching product with ID:", id);
        const product = await Product.findById(id)
          .populate("category")
          .populate("seller")
          .populate({
            path: "auction",
            populate: {
              path: "bids",
            },
          });

        if (!product) {
          console.log("Product not found");
          throw new Error("Product not found");
        }

        // Ensure auction field is null if no auction exists
        if (!product.auction) {
          product.auction = null;
        }

        console.log("Product found:", product);
        return product;
      } catch (error) {
        console.error("Error fetching product:", error);
        throw new Error("Error fetching product");
      }
    },
  },
  Mutation: {
    signup: async (_, { username, email, password }) =>
      actions.signup(username, email, password),
    login: async (_, { email, password }) => actions.login(email, password),
    googleSignIn: async (parent, { input }) => actions.googleSignIn(input),
    createProduct: async (
      _,
      { name, description, quantity, price, categoryId, image },
      context
    ) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );

      console.log("Received createProduct input:", {
        name,
        description,
        quantity,
        price,
        categoryId,
        image,
      });

      return actions.createProduct(
        name,
        description,
        quantity,
        price,
        categoryId,
        context.user.id,
        image
      );
    },
    createCategory: async (_, { name }, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return actions.createCategory(name);
    },
    createOrder: async (_, { productId, amount }, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return actions.createOrder(context.user.id, productId, amount);
    },
    createFeedback: async (_, { productId, rating, comment }, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return actions.createFeedback(
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
      return actions.createAuction(
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
      return actions.placeBid(context.user.id, productId, amount);
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
      return actions.createPayment(orderId, method, status, transactionId);
    },
    createNotification: async (_, { userId, message }, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return actions.createNotification(userId, message);
    },
  },
  Category: {
    subcategories: async (parent) => parent.subcategories,
  },
  Auction: {
    product: async (parent) => {
      if (!parent.product) return null;
      return Product.findById(parent.product);
    },
  },
};

module.exports = resolvers;
