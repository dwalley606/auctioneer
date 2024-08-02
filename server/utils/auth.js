// server/utils/auth.js
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
const admin = require('../firebase');

const secret = process.env.JWT_SECRET || "your_secret_key";
const expiration = "2h";

module.exports = {
  AuthenticationError: new AuthenticationError(
    "You must be logged in to perform this action"
  ),

  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
    }

    return req;
  },

  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  verifyGoogleToken: async function (idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error("Error verifying Google token:", error);
      return null;
    }
  },
};
