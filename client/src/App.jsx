import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Nav from "./components/Nav/index";
import socket from "./utils/socket";
import AuthService from "./utils/auth";

const GRAPHQL_URI =
  import.meta.env.VITE_GRAPHQL_URI || "http://localhost:3001/graphql";

const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
});

const authLink = setContext((_, { headers }) => {
  const token = AuthService.getToken();
  console.log("Token being sent:", token);

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        product: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        auctions: {
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    },
    query: {
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    },
  },
});

function App() {
  const location = useLocation();
  const hideNavRoutes = ["/posting", "/dashboard"];

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    socket.on("bidChange", (data) => {
      console.log("Received bidChange event:", data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("bidChange");
    };
  }, []);

  useEffect(() => {
    const checkTokenValidity = () => {
      const token = AuthService.getToken();
      if (token && AuthService.isTokenExpired(token)) {
        AuthService.logout();
      }
    };

    checkTokenValidity();
  }, [location]);

  return (
    <ApolloProvider client={client}>
      {!hideNavRoutes.includes(location.pathname) && <Nav />}
      <Outlet />
    </ApolloProvider>
  );
}

export { client, socket };
export default App;
