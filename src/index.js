import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker';

// Apollo dependecies
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'


// httplink to connect apolloclient to the GraphQL API
const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
})

// Apolloclient Instance
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

// Wrapping ApolloProvider HOC to APP
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
serviceWorker.unregister();