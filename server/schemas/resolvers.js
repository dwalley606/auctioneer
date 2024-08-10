const {
  AuthenticationError,
  ApolloError,
  UserInputError,
} = require("apollo-server-express");
const mongoose = require("mongoose");
const actions = require("./actions");

// Import necessary models
const Product = require("../models/Product");
const Feedback = require("../models/Feedback");
const User = require("../models/User");

const resolvers = {
  Query: {
    users: async (_, __, context) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      }
      return actions.getUsers();
    },
    products: async () => {
      const products = await actions.getProducts();
      return products.map((product) => ({
        ...product,
        id: product._id.toString(),
        category: product.category
          ? {
              ...product.category,
              id: product.category._id.toString(),
            }
          : null,
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
      if (!category) {
        throw new Error("Category not found");
      }
      return {
        ...category,
        id: category._id.toString(),
      };
    },
    orders: async (_, __, context) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      }
      return actions.getOrders();
    },
    feedbacks: async () => actions.getFeedbacks(),
    feedbacksByProduct: async (_, { productId }) => {
      const feedbacks = await actions.getFeedbacksByProduct(productId);
      return feedbacks.map((feedback) => ({
        ...feedback,
        id: feedback._id.toString(),
        fromUser: {
          ...feedback.fromUser,
          id: feedback.fromUser._id.toString(),
        },
        toUser: {
          ...feedback.toUser,
          id: feedback.toUser._id.toString(),
        },
        product: {
          ...feedback.product,
          id: feedback.product._id.toString(),
        },
        createdAt: feedback.createdAt.toISOString(),
      }));
    },
    auctions: async () => {
      const auctions = await actions.getAuctions();
      return auctions
        .map((auction) => {
          if (!auction.product || !auction.product._id) {
            console.error("Invalid auction data:", auction);
            return null;
          }
          return {
            ...auction,
            id: auction._id.toString(),
            product: {
              ...auction.product,
              id: auction.product._id.toString(),
            },
            startTime: auction.startTime
              ? auction.startTime.toISOString()
              : null,
            endTime: auction.endTime ? auction.endTime.toISOString() : null,
          };
        })
        .filter((auction) => auction !== null); // Remove invalid entries
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
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      }
      return actions.getPayments();
    },
    notifications: async (_, __, context) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      }
      return actions.getNotifications();
    },
    product: async (_, { id }) => {
      const product = await actions.getProductById(id);
      if (!product) {
        throw new Error("Product not found");
      }
      return {
        ...product,
        id: product._id.toString(),
        category: product.category
          ? {
              ...product.category,
              id: product.category._id.toString(),
            }
          : null,
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
    productsByCategory: async (_, { categoryId, subcategoryId }) => {
      console.log("Resolver: Fetching products by category and subcategory:", {
        categoryId,
        subcategoryId,
      });

      return actions.getProductsByCategory(categoryId, subcategoryId);
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
      if (!context.user) {
        throw new AuthenticationError("Not authenticated");
      }
      try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
          throw new Error("Product not found");
        }
        return product;
      } catch (error) {
        throw new ApolloError(error.message, "INTERNAL_SERVER_ERROR", {
          originalError: error,
        });
      }
    },
    createCategory: async (_, { name }, context) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      }
      return actions.createCategory(name);
    },
    createOrder: async (_, { productId, amount }, context) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      }
      return actions.createOrder(context.user.id, productId, amount);
    },
    createFeedback: async (_, { productId, rating, comment }, context) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      }

      // Validate rating
      if (rating < 1 || rating > 5) {
        throw new UserInputError("Rating must be between 1 and 5");
      }

      // Fetch the product to get the seller
      const product = await Product.findById(productId).populate("seller");
      if (!product) {
        console.error("Product not found for feedback submission");
        throw new Error("Product not found");
      }

      try {
        const feedback = await actions.createFeedback(
          context.user.id,
          product.seller._id,
          productId,
          rating,
          comment
        );

        return {
          ...feedback._doc,
          id: feedback._id.toString(),
          fromUser: context.user,
          toUser: product.seller,
          product,
          createdAt: feedback.createdAt.toISOString(),
        };
      } catch (error) {
        console.error("Error in createFeedback resolver:", error);
        throw new ApolloError(
          "Failed to create feedback",
          "FEEDBACK_CREATION_ERROR",
          {
            originalError: error,
          }
        );
      }
    },

    createAuction: async (
      _,
      { productId, startTime, endTime, startingPrice, status },
      context
    ) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      }

      try {
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          throw new UserInputError(
            "Invalid date format for startTime or endTime"
          );
        }

        const auction = await actions.createAuction(
          productId,
          start,
          end,
          startingPrice,
          status
        );

        return {
          ...auction.toObject(),
          id: auction._id.toString(),
          product: auction.product.toString(),
          startTime: auction.startTime.toISOString(),
          endTime: auction.endTime.toISOString(),
        };
      } catch (error) {
        console.error("Error in createAuction resolver:", error);
        throw new ApolloError(
          "Failed to create auction",
          "AUCTION_CREATION_ERROR",
          { error }
        );
      }
    },
    placeBid: async (_, { productId, amount }, context) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      }
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
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      }
      const payment = await actions.createPayment(
        orderId,
        method,
        status,
        transactionId
      );

      payment.id = payment._id.toString();
      payment.order = payment.order.toString();

      return payment;
    },
    createNotification: async (_, { userId, message }, context) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      }
      const notification = await actions.createNotification(userId, message);

      notification.id = notification._id.toString();
      notification.user = notification.user.toString();

      return notification;
    },
    updateUserProfile: async (_, { input }, context) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      }
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
