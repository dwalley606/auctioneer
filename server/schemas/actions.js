const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const Feedback = require("../models/Feedback");
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const Payment = require("../models/Payment");
const Notification = require("../models/Notification");
const { ObjectId } = require("mongoose");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const signup = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  const token = generateToken(user);
  return { token, user };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user);
  return { token, user };
};

// User Actions
const createUser = async (firstName, lastName, email, password) => {
  const user = new User({ firstName, lastName, email, password });
  return await user.save();
};

const getUsers = async () => {
  return await User.find();
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
  const product = new Product({
    name,
    description,
    quantity,
    price,
    category: categoryId,
    seller: sellerId,
  });
  return await product.save();
};

const getProducts = async () => {
  return await Product.find().populate("category").populate("seller");
};

// Category Actions
const createCategory = async (name) => {
  const category = new Category({ name });
  return await category.save();
};

const getCategories = async () => {
  return await Category.find();
};

// Order Actions
const createOrder = async (buyerId, productId, amount, paymentId) => {
  const order = new Order({
    buyer: buyerId,
    product: productId,
    amount,
    payment: paymentId,
  });
  return await order.save();
};

const getOrders = async () => {
  return await Order.find()
    .populate("buyer")
    .populate("product")
    .populate("payment");
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
  return await Feedback.find().populate("user").populate("product");
};

// Auction Actions
const createAuction = async (
  productId,
  startTime,
  endTime,
  startingPrice,
  status
) => {
  const auction = new Auction({
    product: productId,
    startTime,
    endTime,
    startingPrice,
    status,
  });
  return await auction.save();
};

const getAuctions = async () => {
  return await Auction.find().populate("product").populate("bids");
};

// Bid Actions
const createBid = async (userId, productId, amount) => {
  const bid = new Bid({ user: userId, product: productId, amount });
  return await bid.save();
};

const getBids = async () => {
  return await Bid.find().populate("user").populate("product");
};

// Payment Actions
const createPayment = async (orderId, method, status, transactionId) => {
  const payment = new Payment({
    order: orderId,
    method,
    status,
    transactionId,
  });
  return await payment.save();
};

const getPayments = async () => {
  return await Payment.find().populate("order");
};

// Notification Actions
const createNotification = async (userId, message) => {
  const notification = new Notification({ user: userId, message });
  return await notification.save();
};

const getNotifications = async () => {
  return await Notification.find().populate("user");
};

module.exports = {
  signup,
  login,
  createUser,
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
  createBid,
  getBids,
  createPayment,
  getPayments,
  createNotification,
  getNotifications,
};
