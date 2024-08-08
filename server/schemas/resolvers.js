const {
  AuthenticationError,
  ApolloError,
  UserInputError,
} = require("apollo-server-express");
const mongoose = require("mongoose");
const { Product, User, Category, Subcategory } = require("../models");
const actions = require("./actions");

const resolvers = {
  Query: {
    users: async (_, __, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return actions.getUsers();
    },
    products: async () => {
      const products = await actions.getProducts();
      return products.map((product) => ({
        ...product,
        id: product._id.toString(),
        category: {
          ...product.category,
          id: product.category._id.toString(),
        },
        subcategory: product.subcategory
          ? {
              ...product.subcategory,
              id: product.subcategory._id.toString(),
            }
          : null,
        seller: {
          ...product.seller,
          id: product.seller._id.toString(),
        },
      }));
    },
    categories: async () => actions.getCategories(),
    category: async (_, { id }) => {
      const category = await actions.getCategoryById(id);
      return {
        ...category,
        id: category._id.toString(),
      };
    },
    orders: async (_, __, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return actions.getOrders();
    },
    feedbacks: async () => actions.getFeedbacks(),
    auctions: async () => {
      const auctions = await actions.getAuctions();
      return auctions.map((auction) => ({
        ...auction,
        id: auction._id.toString(),
        product: {
          ...auction.product,
          id: auction.product._id.toString(),
        },
        startTime: auction.startTime ? auction.startTime.toISOString() : null,
        endTime: auction.endTime ? auction.endTime.toISOString() : null,
      }));
    },
    bids: async () => {
      const bids = await actions.getBids();
      return bids.map((bid) => ({
        ...bid,
        id: bid._id.toString(),
        user: bid.user.toString(),
        product: bid.product.toString(),
        timestamp: bid.timestamp.toISOString(),
      }));
    },
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
      const product = await actions.getProductById(id);
      if (!product) throw new Error("Product not found");
      return {
        ...product,
        id: product._id.toString(),
        category: {
          ...product.category,
          id: product.category._id.toString(),
        },
        subcategory: product.subcategory
          ? {
              ...product.subcategory,
              id: product.subcategory._id.toString(),
            }
          : null,
        seller: {
          ...product.seller,
          id: product.seller._id.toString(),
        },
      };
    },
  },
  Mutation: {
    signup: async (_, { username, email, password }) =>
      actions.signup(username, email, password),
    login: async (_, { email, password }) => actions.login(email, password),
    googleSignIn: async (_, { input }) => actions.googleSignIn(input),
    createProduct: async (_, { input }, context) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      }

      console.log("Resolver received:", input);

      // Validate input
      if (
        !input.name ||
        !input.description ||
        !input.quantity ||
        !input.price ||
        !input.categoryId ||
        !input.subcategoryId ||
        !input.image ||
        !input.sellerId
      ) {
        throw new UserInputError("All fields are required");
      }

      try {
        // Ensure ObjectId instances
        const productData = {
          ...input,
          categoryId: new mongoose.Types.ObjectId(input.categoryId),
          subcategoryId: new mongoose.Types.ObjectId(input.subcategoryId),
          sellerId: new mongoose.Types.ObjectId(input.sellerId),
        };

        const createdProduct = await actions.createProduct(productData);

        // Fetch the newly created product to populate references
        const populatedProduct = await actions.getProductById(
          createdProduct._id
        );

        if (!populatedProduct) {
          throw new Error("Product not found after creation");
        }

        return {
          ...populatedProduct,
          id: populatedProduct._id.toString(),
          category: populatedProduct.category
            ? {
                ...populatedProduct.category,
                id: populatedProduct.category._id.toString(),
              }
            : null,
          subcategory: populatedProduct.subcategory
            ? {
                ...populatedProduct.subcategory,
                id: populatedProduct.subcategory._id.toString(),
              }
            : null,
          seller: populatedProduct.seller
            ? {
                ...populatedProduct.seller,
                id: populatedProduct.seller._id.toString(),
              }
            : null,
        };
      } catch (error) {
        console.error("Error in createProduct resolver:", error);
        throw new ApolloError(error.message, "INTERNAL_SERVER_ERROR", {
          originalError: error,
        });
      }
    },
    deleteProduct: async (_, { id }, context) => {
      if (!context.user) throw new AuthenticationError("Not authenticated");
      try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) throw new Error("Product not found");
        return product;
      } catch (error) {
        throw new ApolloError(error.message, "INTERNAL_SERVER_ERROR", {
          originalError: error,
        });
      }
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
      const auction = await actions.createAuction(
        productId,
        startTime,
        endTime,
        startingPrice,
        status
      );

      // Convert ObjectId fields to string
      auction.id = auction._id.toString();
      auction.product = auction.product.toString();
      auction.startTime = auction.startTime.toISOString();
      auction.endTime = auction.endTime.toISOString();

      return auction;
    },
    placeBid: async (_, { productId, amount }, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      const bid = await actions.placeBid(context.user.id, productId, amount);

      // Convert ObjectId fields to string
      bid.id = bid._id.toString();
      bid.user = bid.user.toString();
      bid.product = bid.product.toString();
      bid.timestamp = bid.timestamp.toISOString();

      return bid;
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
      const payment = await actions.createPayment(
        orderId,
        method,
        status,
        transactionId
      );

      // Convert ObjectId fields to string
      payment.id = payment._id.toString();
      payment.order = payment.order.toString();

      return payment;
    },
    createNotification: async (_, { userId, message }, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      const notification = await actions.createNotification(userId, message);

      // Convert ObjectId fields to string
      notification.id = notification._id.toString();
      notification.user = notification.user.toString();

      return notification;
    },
    updateUserProfile: async (_, { input }, context) => {
      if (!context.user)
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      return actions.updateUserProfile(context.user.id, input);
    },
  },
  Category: {
    subcategories: async (parent) => parent.subcategories,
  },
  Auction: {
    product: async (parent) => {
      if (!parent.product) return null;
      const product = await actions.getProductById(parent.product);
      return {
        ...product,
        id: product._id.toString(),
      };
    },
  },
};

module.exports = resolvers;
