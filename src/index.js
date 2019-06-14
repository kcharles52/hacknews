import React from "react";
import { BrowserRouter } from "react-router-dom";

import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

// Apollo dependecies
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

import { AUTH_TOKEN } from "./constants";

// httplink to connect apolloclient to the GraphQL API
const httpLink = createHttpLink({
  uri: "http://localhost:4000"
});

// apollo link middleware
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

// apollo websocket
const wsLink = new WebSocketLink({
  uri:`ws://localhost:4000`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN),
    }
  }
})

const link = split(({query}) => {
  const { kind, operation } = getMainDefinition(query)
  return kind === 'OperationDefinition' && operation === 'subscription'
},
wsLink,
authLink.concat(httpLink)
)

// Apolloclient Instance
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

// Wrapping ApolloProvider HOC to APP
ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
serviceWorker.unregister();
