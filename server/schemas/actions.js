const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const Feedback = require("../models/Feedback");
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const Payment = require("../models/Payment");
const Notification = require("../models/Notification");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// User Actions
const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Signup action
const signup = async (username, email, password) => {
  console.log("Signup called with:", { username, email, password });

  if (!password) {
    throw new Error("Password is required");
  }

  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) {
    console.log("Email already in use");
    throw new Error("Email already in use");
  }

  const existingUserByUsername = await User.findOne({ username });
  if (existingUserByUsername) {
    console.log("Username already in use");
    throw new Error("Username already in use");
  }

  const user = new User({
    username,
    email,
    password,
  });

  try {
    await user.save();
    console.log("User created:", user);
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }

  const token = generateToken(user);
  return { token, user };
};

// Login action
const login = async (email, password) => {
  console.log("Login called with:", { email, password });
  const user = await User.findOne({ email });
  if (!user) {
    console.error("User not found");
    throw new Error("Invalid credentials");
  }
  console.log("User found:", user);
  try {
    const isMatch = await user.isCorrectPassword(password);
    console.log("Password match:", isMatch);
    if (!isMatch) {
      console.error("Password does not match");
      throw new Error("Invalid credentials");
    }
    const token = generateToken(user);
    return { token, user };
  } catch (error) {
    console.error("Error during password comparison:", error);
    throw new Error("Error during password comparison");
  }
};

// Google Sign-In action
const googleSignIn = async (parent, { input }) => {
  try {
    console.log("Google sign-in attempt for email:", input.email);
    let user = await User.findOne({ email: input.email });

    if (!user) {
      // Create new user without a password
      user = new User({
        username: input.username,
        email: input.email,
        googleId: input.googleId,
        photoUrl: input.photoUrl,
      });
      await user.save();
      console.log("New user created:", user);
    } else if (!user.googleId) {
      // Update existing user with Google ID and photo URL if not already set
      user.googleId = input.googleId;
      user.photoUrl = input.photoUrl;
      await user.save();
      console.log("User updated with Google ID:", user);
    }

    const token = generateToken(user);
    return { token, user };
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw new Error("Unable to authenticate with Google");
  }
};

// Signout action
const signout = async (req, res) => {
  try {
    res.status(200).json({ message: "Signout successful" });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: "Signout failed", error: error.message });
    }
  }
};

// Get users
const getUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Unable to fetch users");
  }
};

// Product Actions
const createProduct = async (
  name,
  description,
  quantity,
  price,
  categoryId,
  sellerId
) => {
  try {
    const product = new Product({
      name,
      description,
      quantity,
      price,
      category: categoryId,
      seller: sellerId,
    });
    console.log("Creating product:", product);
    const savedProduct = await product.save();
    console.log("Product created:", savedProduct);
    return savedProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Unable to create product");
  }
};

const getProducts = async () => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("seller");
    console.log("Products fetched from DB: ", products);
    return products;
  } catch (error) {
    console.error("Error fetching products: ", error);
    throw new Error("Error fetching products");
  }
};

// Category Actions
const createCategory = async (name) => {
  try {
    const category = new Category({ name });
    console.log("Creating category:", category);
    const savedCategory = await category.save();
    console.log("Category created:", savedCategory);
    return savedCategory;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Unable to create category");
  }
};

const getCategories = async () => {
  try {
    const categories = await Category.find();
    console.log("Categories fetched from DB: ", categories);
    return categories;
  } catch (error) {
    console.error("Error fetching categories: ", error);
    throw new Error("Error fetching categories");
  }
};

// Order Actions
const createOrder = async (buyerId, productId, amount, paymentId) => {
  try {
    const order = new Order({
      buyer: buyerId,
      product: productId,
      amount,
      payment: paymentId,
    });
    console.log("Creating order:", order);
    const savedOrder = await order.save();
    console.log("Order created:", savedOrder);
    return savedOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Unable to create order");
  }
};

const getOrders = async () => {
  try {
    const orders = await Order.find()
      .populate("buyer")
      .populate("product")
      .populate("payment");
    console.log("Orders fetched from DB: ", orders);
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Error fetching orders");
  }
};

// Feedback Actions
const createFeedback = async (
  fromUserId,
  toUserId,
  productId,
  rating,
  comment
) => {
  const feedback = new Feedback({
    fromUser: fromUserId,
    toUser: toUserId,
    product: productId,
    rating,
    comment,
  });
  return await feedback.save();
};

const getFeedbacks = async () => {
  try {
    const feedbacks = await Feedback.find()
      .populate("fromUser")
      .populate("toUser")
      .populate("product");
    console.log("Feedbacks fetched from DB: ", feedbacks);
    return feedbacks;
  } catch (error) {
    console.error("Error fetching feedbacks: ", error);
    throw new Error("Error fetching feedbacks");
  }
};

// Auction Actions
const createAuction = async (
  productId,
  startTime,
  endTime,
  startingPrice,
  status
) => {
  try {
    const auction = new Auction({
      product: productId,
      startTime,
      endTime,
      startingPrice,
      status,
    });
    console.log("Creating auction:", auction);
    const savedAuction = await auction.save();
    console.log("Auction created:", savedAuction);
    return savedAuction;
  } catch (error) {
    console.error("Error creating auction:", error);
    throw new Error("Unable to create auction");
  }
};

const getAuctions = async () => {
  try {
    const auctions = await Auction.find().populate("product").populate("bids");
    // console.log("Auctions fetched from DB: ", auctions);
    return auctions;
  } catch (error) {
    console.error("Error fetching auctions:", error);
    throw new Error("Error fetching auctions");
  }
};

// Bid Actions
const placeBid = async (userId, productId, amount) => {
  try {
    const bid = new Bid({
      user: userId,
      product: productId,
      amount,
      timestamp: new Date(),
    });
    console.log("Creating bid:", bid);
    const createdBid = await bid.save();

    await Auction.updateOne(
      { product: productId },
      { $push: { bids: createdBid._id } }
    );

    console.log("Bid created:", createdBid);
    return {
      _id: createdBid._id,
      user: createdBid.user,
      product: createdBid.product,
      amount: createdBid.amount,
      timestamp: createdBid.timestamp,
    };
  } catch (error) {
    console.error("Error creating bid:", error);
    throw new Error("Unable to create bid");
  }
};

const getBids = async () => {
  try {
    const bids = await Bid.find().populate("user").populate("product");
    console.log("Bids fetched from DB: ", bids);
    return bids;
  } catch (error) {
    console.error("Error fetching bids:", error);
    throw new Error("Error fetching bids");
  }
};

// Payment Actions
const createPayment = async (orderId, method, status, transactionId) => {
  try {
    const payment = new Payment({
      order: orderId,
      method,
      status,
      transactionId,
    });
    console.log("Creating payment:", payment);
    const savedPayment = await payment.save();
    console.log("Payment created:", savedPayment);
    return savedPayment;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw new Error("Unable to create payment");
  }
};

const getPayments = async () => {
  try {
    const payments = await Payment.find().populate("order");
    console.log("Payments fetched from DB: ", payments);
    return payments;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw new Error("Error fetching payments");
  }
};

// Notification Actions
const createNotification = async (userId, message) => {
  try {
    const notification = new Notification({
      user: userId,
      message,
      read: false,
      timestamp: new Date(),
    });
    console.log("Creating notification:", notification);
    const createdNotification = await notification.save();
    console.log("Notification created:", createdNotification);
    return {
      _id: createdNotification._id,
      user: createdNotification.user,
      message: createdNotification.message,
      read: createdNotification.read,
      timestamp: createdNotification.timestamp,
    };
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Unable to create notification");
  }
};

const getNotifications = async () => {
  try {
    const notifications = await Notification.find().populate("user");
    console.log("Notifications fetched from DB: ", notifications);
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Error fetching notifications");
  }
};

module.exports = {
  signup,
  login,
  googleSignIn,
  signout,
  getUsers,
  createProduct,
  getProducts,
  createCategory,
  getCategories,
  createOrder,
  getOrders,
  createFeedback,
  getFeedbacks,
  createAuction,
  getAuctions,
  placeBid,
  getBids,
  createPayment,
  getPayments,
  createNotification,
  getNotifications,
};
