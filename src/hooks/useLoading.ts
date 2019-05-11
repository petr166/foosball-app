import { useState, useEffect } from 'react';

import { parseError, ExtendedError } from '../utils';

export const useLoading = (
  defaultVal: boolean = false
): [
  boolean,
  (
    val: boolean,
    error?: Error | null | undefined,
    options?: { timeout?: number }
  ) => void,
  string | null | undefined,
  ExtendedError | null,
  boolean
] => {
  const [showSpinner, setShowSpinner] = useState(defaultVal);
  const [disableActions, setDisableActions] = useState(defaultVal);
  const [error, setError] = useState<ExtendedError | null>(null);

  let loadingTimeout: number;

  // clear timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, []);

  const waitSetLoading = (
    val: boolean,
    error: Error | null = null,
    options: { timeout?: number } = {}
  ) => {
    const { timeout = 300 } = options;

    if (loadingTimeout) clearTimeout(loadingTimeout);
    setDisableActions(val);
    setError(error ? parseError(error) : null);

    if (val) {
      loadingTimeout = setTimeout(() => {
        setShowSpinner(val);
      }, timeout);
    } else {
      setShowSpinner(false);
    }
  };

  return [
    showSpinner,
    waitSetLoading,
    error ? error.text : null,
    error,
    disableActions,
  ];
};
