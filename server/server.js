const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const { authMiddleware } = require("./utils/auth");
const dotenv = require("dotenv");
const cors = require("cors");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const { signout } = require("./schemas/actions"); // Ensure signout is correctly imported

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error("GraphQL Error:", error);
    return error;
  },
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();

  app.use(
    cors({
      origin: ["http://localhost:3000", "https://localhost:3000"], // Allow both HTTP and HTTPS origins
      credentials: true,
    })
  );

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Serve up static assets
  app.use("/images", express.static(path.join(__dirname, "../client/images")));

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  app.post("/graphql/auth/google", async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ error: "No token provided" }); 
      }
      const result = await validateFirebaseToken(token);
      return res.json(result);
    } catch (error) {
      console.error("Google auth error:", error);
      return res.status(400).json({ error: error.message }); 
    }
  });


  // Add the signout route
  app.post("/user/signout", async (req, res) => {
    try {
      await signout(req, res);
    } catch (error) {
      if (!res.headersSent) {
        // Ensure headers are not sent multiple times
        res.status(500).json({ error: error.message });
      }
    }
  });
  
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer().catch((error) => {
  console.error("Failed to start server:", error);
});
