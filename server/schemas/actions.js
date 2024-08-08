const mongoose = require("mongoose");
const { ApolloError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Order = require("../models/Order");
const Feedback = require("../models/Feedback");
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const Payment = require("../models/Payment");
const Notification = require("../models/Notification");

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const signup = async (username, email, password) => {
  if (!password) throw new Error("Password is required");

  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) throw new Error("Email already in use");

  const existingUserByUsername = await User.findOne({ username });
  if (existingUserByUsername) throw new Error("Username already in use");

  const user = new User({ username, email, password });
  await user.save();
  return { token: generateToken(user), user };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await user.isCorrectPassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user);
  return { token, user };
};

const googleSignIn = async ({ username, email, googleId, photoUrl }) => {
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ username, email, googleId, photoUrl });
    await user.save();
  } else if (!user.googleId) {
    user.googleId = googleId;
    user.photoUrl = photoUrl;
    await user.save();
  }

  return { token: generateToken(user), user };
};

const signout = async (req, res) => {
  try {
    res.status(200).json({ message: "Signout successful" });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: "Signout failed", error: error.message });
    }
  }
};

const getUsers = async () => User.find();

const createProduct = async (input) => {
  try {
    const product = new Product({
      name: input.name,
      description: input.description,
      quantity: input.quantity,
      price: input.price,
      category: new mongoose.Types.ObjectId(input.categoryId),
      subcategory: new mongoose.Types.ObjectId(input.subcategoryId),
      seller: new mongoose.Types.ObjectId(input.sellerId),
      image: input.image,
    });

    await product.save();

    const populatedProduct = await Product.findById(product._id)
      .populate("category")
      .populate("subcategory")
      .populate("seller")
      .lean();

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
    console.error("Error in createProduct:", error);
    throw new ApolloError(error.message, "INTERNAL_SERVER_ERROR", {
      originalError: error,
    });
  }
};

const getProducts = async () => {
  const products = await Product.find()
    .populate("category")
    .populate("subcategory")
    .populate("seller")
    .lean();

  return products.map((product) => ({
    ...product,
    id: product._id.toString(),
    category: product.category
      ? { ...product.category, id: product.category._id.toString() }
      : null,
    subcategory: product.subcategory
      ? { ...product.subcategory, id: product.subcategory._id.toString() }
      : null,
    seller: product.seller
      ? { ...product.seller, id: product.seller._id.toString() }
      : null,
  }));
};

const getProductById = async (id) => {
  const product = await Product.findById(id)
    .populate("category")
    .populate("subcategory")
    .populate("seller")
    .lean();

  if (!product) {
    throw new Error("Product not found");
  }

  return {
    ...product,
    id: product._id.toString(),
    category: product.category
      ? { ...product.category, id: product.category._id.toString() }
      : null,
    subcategory: product.subcategory
      ? { ...product.subcategory, id: product.subcategory._id.toString() }
      : null,
    seller: product.seller
      ? { ...product.seller, id: product.seller._id.toString() }
      : null,
  };
};

const createCategory = async (name) => {
  const category = new Category({ name });
  await category.save();
  return category;
};

const getCategories = async () => {
  const categories = await Category.find().lean();
  return categories.map((category) => ({
    ...category,
    id: category._id.toString(),
    subcategories: category.subcategories.map((subcat) => ({
      ...subcat,
      id: subcat._id.toString(),
    })),
  }));
};

const createOrder = async (buyerId, productId, amount, paymentId) => {
  const order = new Order({
    buyer: new mongoose.Types.ObjectId(buyerId),
    product: new mongoose.Types.ObjectId(productId),
    amount,
    payment: new mongoose.Types.ObjectId(paymentId),
  });
  await order.save();
  return order;
};

const getOrders = async () => {
  const orders = await Order.find()
    .populate("buyer")
    .populate("product")
    .populate("payment")
    .lean();
  return orders.map((order) => ({
    ...order,
    id: order._id.toString(),
    buyer: order.buyer
      ? { ...order.buyer, id: order.buyer._id.toString() }
      : null,
    product: order.product
      ? { ...order.product, id: order.product._id.toString() }
      : null,
    payment: order.payment
      ? { ...order.payment, id: order.payment._id.toString() }
      : null,
  }));
};

const createFeedback = async (
  fromUserId,
  toUserId,
  productId,
  rating,
  comment
) => {
  const feedback = new Feedback({
    fromUser: new mongoose.Types.ObjectId(fromUserId),
    toUser: new mongoose.Types.ObjectId(toUserId),
    product: new mongoose.Types.ObjectId(productId),
    rating,
    comment,
  });
  await feedback.save();
  return feedback;
};

const getFeedbacks = async () => {
  const feedbacks = await Feedback.find()
    .populate("fromUser")
    .populate("toUser")
    .populate("product")
    .lean();
  return feedbacks.map((feedback) => ({
    ...feedback,
    id: feedback._id.toString(),
    fromUser: feedback.fromUser
      ? { ...feedback.fromUser, id: feedback.fromUser._id.toString() }
      : null,
    toUser: feedback.toUser
      ? { ...feedback.toUser, id: feedback.toUser._id.toString() }
      : null,
    product: feedback.product
      ? { ...feedback.product, id: feedback.product._id.toString() }
      : null,
  }));
};

const createAuction = async (
  productId,
  startTime,
  endTime,
  startingPrice,
  status
) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error(`Product with ID ${productId} does not exist`);

  const auction = new Auction({
    product: new mongoose.Types.ObjectId(productId),
    startTime,
    endTime,
    startingPrice,
    status,
  });
  await auction.save();
  return auction;
};

const getAuctions = async () => {
  const auctions = await Auction.find()
    .populate("product")
    .populate("bids")
    .lean();
  return auctions.map((auction) => ({
    ...auction,
    id: auction._id.toString(),
    product: auction.product
      ? { ...auction.product, id: auction.product._id.toString() }
      : null,
    bids: auction.bids.map((bid) => ({
      ...bid,
      id: bid._id.toString(),
    })),
  }));
};

const placeBid = async (userId, productId, amount) => {
  const bid = new Bid({
    user: new mongoose.Types.ObjectId(userId),
    product: new mongoose.Types.ObjectId(productId),
    amount,
    timestamp: new Date(),
  });
  await bid.save();
  await Auction.updateOne({ product: productId }, { $push: { bids: bid._id } });
  return bid;
};

const getBids = async () => {
  const bids = await Bid.find().populate("user").populate("product").lean();
  return bids.map((bid) => ({
    ...bid,
    id: bid._id.toString(),
    user: bid.user ? { ...bid.user, id: bid.user._id.toString() } : null,
    product: bid.product
      ? { ...bid.product, id: bid.product._id.toString() }
      : null,
  }));
};

const createPayment = async (orderId, method, status, transactionId) => {
  const payment = new Payment({
    order: new mongoose.Types.ObjectId(orderId),
    method,
    status,
    transactionId,
  });
  await payment.save();
  return payment;
};

const getPayments = async () => {
  const payments = await Payment.find().populate("order").lean();
  return payments.map((payment) => ({
    ...payment,
    id: payment._id.toString(),
    order: payment.order
      ? { ...payment.order, id: payment.order._id.toString() }
      : null,
  }));
};

const createNotification = async (userId, message) => {
  const notification = new Notification({
    user: new mongoose.Types.ObjectId(userId),
    message,
    read: false,
    timestamp: new Date(),
  });
  await notification.save();
  return notification;
};

const getNotifications = async () => {
  const notifications = await Notification.find().populate("user").lean();
  return notifications.map((notification) => ({
    ...notification,
    id: notification._id.toString(),
    user: notification.user
      ? { ...notification.user, id: notification.user._id.toString() }
      : null,
  }));
};

module.exports = {
  signup,
  login,
  googleSignIn,
  signout,
  getUsers,
  createProduct,
  getProducts,
  getProductById,
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
