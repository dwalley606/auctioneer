const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const { authMiddleware } = require("./utils/auth");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const { graphqlUploadExpress } = require("graphql-upload");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const { signout } = require("./schemas/actions");
const pollForChanges = require("./polling"); // Import the polling module

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

// Create an HTTP server
const httpServer = http.createServer(app);

// Setup Socket.IO server with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://localhost:3000"],
    credentials: true,
  },
});

// Socket.IO connection events
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Create an Apollo Server instance
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
});

// Function to start the Apollo Server
const startApolloServer = async () => {
  try {
    await apolloServer.start();

    // Middleware for CORS, JSON parsing, cookies, and static files
    app.use(
      cors({
        origin: ["http://localhost:3000", "https://localhost:3000"],
        credentials: true,
      })
    );
    app.use(express.json());
    app.use(cookieParser());
    app.use(
      "/images",
      express.static(path.join(__dirname, "../client/images"))
    );
    app.use(graphqlUploadExpress());

    // Apply authentication middleware and Apollo GraphQL middleware
    app.use("/graphql", authMiddleware);
    app.use(
      "/graphql",
      expressMiddleware(apolloServer, {
        context: ({ req }) => {
          console.log("GraphQL request context user:", req.user);
          console.log(
            "GraphQL request body:",
            JSON.stringify(req.body, null, 2)
          );
          return { user: req.user };
        },
      })
    );

    // Route for Google authentication
    app.post("/graphql/auth/google", async (req, res) => {
      try {
        const { token } = req.body;
        if (!token) {
          return res.status(400).json({ error: "No token provided" });
        }
        const result = await validateFirebaseToken(token);
        return res.json(result);
      } catch (error) {
        console.error("Google auth error: ", error);
        return res.status(400).json({ error: error.message });
      }
    });

    // Route for user signout
    app.post("/user/signout", async (req, res) => {
      try {
        await signout(req, res);
      } catch (error) {
        if (!res.headersSent) {
          res.status(500).json({ error: error.message });
        }
      }
    });

    // Serve static files in production
    if (process.env.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../client/dist")));
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"));
      });
    }

    // Start the database and server
    db.once("open", () => {
      httpServer.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
      });

      // Start polling for changes
      pollForChanges(io).catch((err) =>
        console.error("Failed to poll for changes: ", err)
      );
    });
  } catch (error) {
    console.error("Failed to start Apollo server: ", error);
  }
};

// Start the Apollo Server
startApolloServer().catch((error) => {
  console.error("Failed to start server: ", error);
});
