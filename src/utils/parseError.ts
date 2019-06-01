import { ApolloError } from 'apollo-boost';

export interface ExtendedError extends ApolloError {
  text: string;
}

export const parseError = (error: ApolloError) => {
  const { networkError, graphQLErrors, message } = error;
  const extendedError: ExtendedError = { ...error, text: '' };

  if (!!graphQLErrors && graphQLErrors.length) {
    const splitMsg = graphQLErrors[0].message.split(': ');
    extendedError.text = splitMsg[splitMsg.length - 1];
  } else if (!!networkError) {
    extendedError.text = 'Network failure. Check your connectivity.';
  } else if (!!message) {
    const splitMsg = message.split(': ');
    extendedError.text = splitMsg[splitMsg.length - 1];
  } else {
    extendedError.text = 'There was an error.';
  }

  return extendedError;
};
