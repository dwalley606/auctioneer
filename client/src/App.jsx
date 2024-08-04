import React from "react";
import { Outlet } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Nav from "./components/Nav/index";

// Define the GraphQL endpoint
const GRAPHQL_URI =
  import.meta.env.VITE_GRAPHQL_URI || "http://localhost:3001/graphql";

const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
});

// Function to get the token from localStorage
const getToken = () => localStorage.getItem("id_token");

// Auth link to include the token in the headers
const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Configure the cache
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        product: {
          // Merge function for individual products
          merge(existing, incoming) {
            return incoming;
          },
        },
        auctions: {
          // Merge function for auctions
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});

// Apollo Client instance
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
  return (
    <ApolloProvider client={client}>
      <Nav />
      <Outlet />
    </ApolloProvider>
  );
}

export { client }; // Export the client
export default App;
