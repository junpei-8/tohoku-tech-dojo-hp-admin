import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { environment } from './environments/environment';

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: `${environment.apiHost}/query`,
});

export default apolloClient;
