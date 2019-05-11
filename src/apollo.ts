import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import { setContext } from 'apollo-link-context';
import { getGlobal } from 'reactn';

import { IGlobalState } from './global';
import { API_URI } from './config/constants';

const httpLink = new HttpLink({
  uri: API_URI,
});

const authLink = setContext((_, { headers }) => {
  const authToken = getGlobal<IGlobalState>().authToken;

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: authToken ? authToken : '',
    },
  };
});

export const initApolloClient = () => {
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};
