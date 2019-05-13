import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
} from 'apollo-boost';
import { onError } from 'apollo-link-error';
import { getGlobal } from 'reactn';

import { IGlobalState } from './global';
import { API_URI } from './config/constants';
import { logout } from './login';

const httpLink = new HttpLink({
  uri: API_URI,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const authToken = getGlobal<IGlobalState>().authToken;

  // add the authorization to the headers
  operation.setContext(({ headers = {} }: any) => ({
    headers: {
      ...headers,
      authorization: authToken ? authToken : '',
    },
  }));

  return forward ? forward(operation) : null;
});

const errorMiddleware = onError((error: any) => {
  console.log('====================================');
  console.log('GraphQL error:', error);
  console.log('====================================');

  const { networkError = {} } = error;
  if (networkError.statusCode === 401) logout();
});

export const initApolloClient = () => {
  return new ApolloClient({
    link: from([errorMiddleware, authMiddleware, httpLink]),
    cache: new InMemoryCache(),
  });
};
