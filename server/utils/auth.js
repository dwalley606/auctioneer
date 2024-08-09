const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "your_secret_key";
const expiration = "2h";

module.exports = {
  authMiddleware: function (req, res, next) {
    let token = req.headers.authorization;

    // Log the entire request headers for debugging purposes
    console.log("Request Headers:", JSON.stringify(req.headers, null, 2));

    if (token) {
      console.log("Received token:", token);

      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft();
      }

      try {
        const decoded = jwt.verify(token, secret);
        console.log("Token verified, user data:", decoded);
        req.user = decoded;
      } catch (err) {
        console.log("Invalid token:", err.message);
        req.user = null;
      }
    } else {
      console.log("No token found in request");
      req.user = null;
    }

    next();
  },
  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  verifyGoogleToken: async function (idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log("Google token verified:", decodedToken);
      return decodedToken;
    } catch (error) {
      console.error("Error verifying Google token:", error);
      return null;
    }
  },
};
