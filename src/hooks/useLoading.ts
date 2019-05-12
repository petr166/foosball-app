import { useState, useEffect } from 'react';
import { v1 as uuid } from 'uuid';

import { parseError, ExtendedError } from '../utils';

const timeoutRefs: any = {};

const superClearTimeout = (id: string) => {
  if (timeoutRefs[id]) {
    clearTimeout(timeoutRefs[id]);
    delete timeoutRefs[id];
  }
};

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
  const [id] = useState(uuid());
  const [error, setError] = useState<ExtendedError | null>(null);

  // clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRefs[id]) superClearTimeout(id);
    };
  }, []);

  const waitSetLoading = (
    val: boolean,
    error: Error | null = null,
    options: { timeout?: number } = {}
  ) => {
    const { timeout = 300 } = options;

    if (timeoutRefs[id]) superClearTimeout(id);
    setDisableActions(val);
    setError(error ? parseError(error) : null);

    if (val) {
      timeoutRefs[id] = window.setTimeout(() => {
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
