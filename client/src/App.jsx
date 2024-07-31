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

// Debugging: Check if the environment variable is being read correctly
console.log("Environment variables:", import.meta.env);
console.log("GRAPHQL_URI:", GRAPHQL_URI);

const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
});

// Debugging: Check if the httpLink is being created correctly
console.log("httpLink:", httpLink);

// Function to get the token from localStorage
const getToken = () => localStorage.getItem("id_token");

// Auth link to include the token in the headers
const authLink = setContext((_, { headers }) => {
  const token = getToken();
  console.log("Auth token:", token ? "Present" : "Not present");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
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

export default App;
