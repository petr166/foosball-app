export interface ExtendedError extends Error {
  text?: string;
  networkError?: Error;
  graphQLErrors?: any[];
}

export const parseError = (error: ExtendedError) => {
  const { networkError, graphQLErrors, message } = error;

  if (networkError) {
    error.text = 'Network failure. Check your connectivity.';
  } else if (graphQLErrors && graphQLErrors.length) {
    const splitMsg = graphQLErrors[0].message.split(': ');
    error.text = splitMsg[splitMsg.length - 1];
  } else if (message) {
    const splitMsg = message.split(': ');
    error.text = splitMsg[splitMsg.length - 1];
  } else {
    error.text = 'There was an error.';
  }

  return error;
};
