const mongoose = require("mongoose");
const { ApolloError } = require("apollo-server-express");
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
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
      .exec();

    if (!populatedProduct) {
      throw new Error("Product not found after creation");
    }

    return {
      ...populatedProduct.toObject(),
      id: populatedProduct._id.toString(),
      category: populatedProduct.category
        ? {
            ...populatedProduct.category.toObject(),
            id: populatedProduct.category._id.toString(),
          }
        : null,
      subcategory: populatedProduct.subcategory
        ? {
            ...populatedProduct.subcategory.toObject(),
            id: populatedProduct.subcategory._id.toString(),
          }
        : null,
      seller: populatedProduct.seller
        ? {
            ...populatedProduct.seller.toObject(),
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

const getProducts = async () =>
  Product.find().populate("category").populate("subcategory");

const createCategory = async (name) => {
  const category = new Category({ name });
  await category.save();
  return category;
};

const getCategories = async () => Category.find();

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

const getOrders = async () =>
  Order.find().populate("buyer").populate("product").populate("payment");

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

const getFeedbacks = async () =>
  Feedback.find().populate("fromUser").populate("toUser").populate("product");

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

const getAuctions = async () =>
  Auction.find().populate("product").populate("bids");

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

const getBids = async () => Bid.find().populate("user").populate("product");

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

const getPayments = async () => Payment.find().populate("order");

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

const getNotifications = async () => Notification.find().populate("user");

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
