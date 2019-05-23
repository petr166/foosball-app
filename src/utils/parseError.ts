import { ApolloError } from 'apollo-boost';

export interface ExtendedError extends ApolloError {
  text?: string;
}

export const parseError = (error: ExtendedError) => {
  const { networkError, graphQLErrors, message } = error;

  if (!!graphQLErrors && graphQLErrors.length) {
    const splitMsg = graphQLErrors[0].message.split(': ');
    error.text = splitMsg[splitMsg.length - 1];
  } else if (!!networkError) {
    error.text = 'Network failure. Check your connectivity.';
  } else if (!!message) {
    const splitMsg = message.split(': ');
    error.text = splitMsg[splitMsg.length - 1];
  } else {
    error.text = 'There was an error.';
  }

  return error;
};
