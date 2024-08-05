const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");
const admin = require("../firebase");

const secret = process.env.JWT_SECRET || "your_secret_key";
const expiration = "2h";

module.exports = {
  authMiddleware: function ({ req }) {
    let token =
      req.body.token ||
      req.query.token ||
      req.headers.authorization ||
      req.cookies.access_token;

    console.log("Request context:", req);
    console.log("Fetching all products...");

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      console.log("No token found");
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log("Authenticated user:", data);
    } catch (error) {
      console.log("Invalid token", error.message);
    }

    return req;
  },

  signToken: function ({ id, username, email }) {
    const payload = { id, username, email };
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
