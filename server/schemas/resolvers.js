const actions = require("./actions");

const resolvers = {
  Query: {
    users: async () => {
      return await actions.getUsers();
    },
    products: async () => {
      return await actions.getProducts();
    },
    categories: async () => {
      return await actions.getCategories();
    },
    orders: async () => {
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
    payments: async () => {
      return await actions.getPayments();
    },
    notifications: async () => {
      return await actions.getNotifications();
    },
  },
  Mutation: {
    signup: async (_, { firstName, lastName, email, password }) => {
      return await actions.signup(firstName, lastName, email, password);
    },
    login: async (_, { email, password }) => {
      return await actions.login(email, password);
    },
    createUser: async (
      _,
      { firstName, lastName, email, password },
      context
    ) => {
      if (!context.user) throw new Error("Authentication required");
      return await actions.createUser(firstName, lastName, email, password);
    },
    createProduct: async (
      _,
      { name, description, startingPrice, categoryId, sellerId },
      context
    ) => {
      if (!context.user) throw new Error("Authentication required");
      return await actions.createProduct(
        name,
        description,
        startingPrice,
        categoryId,
        sellerId
      );
    },
    createCategory: async (_, { name }, context) => {
      if (!context.user) throw new Error("Authentication required");
      return await actions.createCategory(name);
    },
    createOrder: async (
      _,
      { buyerId, productId, amount, paymentId },
      context
    ) => {
      if (!context.user) throw new Error("Authentication required");
      return await actions.createOrder(buyerId, productId, amount, paymentId);
    },
    createFeedback: async (
      _,
      { userId, productId, rating, comment },
      context
    ) => {
      if (!context.user) throw new Error("Authentication required");
      return await actions.createFeedback(userId, productId, rating, comment);
    },
    createAuction: async (
      _,
      { productId, startTime, endTime, startingPrice, status },
      context
    ) => {
      if (!context.user) throw new Error("Authentication required");
      return await actions.createAuction(
        productId,
        startTime,
        endTime,
        startingPrice,
        status
      );
    },
    createBid: async (_, { userId, productId, amount }, context) => {
      if (!context.user) throw new Error("Authentication required");
      return await actions.createBid(userId, productId, amount);
    },
    createPayment: async (
      _,
      { orderId, method, status, transactionId },
      context
    ) => {
      if (!context.user) throw new Error("Authentication required");
      return await actions.createPayment(
        orderId,
        method,
        status,
        transactionId
      );
    },
    createNotification: async (_, { userId, message }, context) => {
      if (!context.user) throw new Error("Authentication required");
      return await actions.createNotification(userId, message);
    },
  },
};

module.exports = resolvers;
