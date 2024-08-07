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
      return actions.getUsers();
    },
    products: async () => actions.getProducts(),
    categories: async () => actions.getCategories(),
    category: async (_, { id }) => actions.getCategoryById(id),
    orders: async (_, __, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return actions.getOrders();
    },
    feedbacks: async () => actions.getFeedbacks(),
    auctions: async () => Auction.find().populate("product"),
    bids: async () => actions.getBids(),
    payments: async (_, __, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return actions.getPayments();
    },
    notifications: async (_, __, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return actions.getNotifications();
    },
    product: async (_, { id }) => {
      const product = await Product.findById(id)
        .populate("category")
        .populate("seller")
        .populate({
          path: "auction",
          populate: {
            path: "bids",
          },
        });

      if (!product) throw new Error("Product not found");
      if (!product.auction) product.auction = null;
      return product;
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
    updateUserProfile: async (_, { input }, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      const user = await User.findById(context.user.id);
      if (!user) throw new Error("User not found");

      if (input.username) user.username = input.username;
      if (input.email) user.email = input.email;
      if (input.photoUrl) user.photoUrl = input.photoUrl;
      if (input.profilePicture) user.photoUrl = input.profilePicture;
      if (input.password) user.password = input.password;

      await user.save();
      return user;
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
