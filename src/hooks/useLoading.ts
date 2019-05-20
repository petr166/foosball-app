import { useState, useEffect, useRef } from 'react';
import { v1 as uuid } from 'uuid';

import { parseError, ExtendedError, showLoadingOverlay } from '../utils';

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
    options?: { timeout?: number; withLoadingOverlay?: boolean }
  ) => void,
  string | null | undefined,
  ExtendedError | null,
  boolean
] => {
  const [showSpinner, setShowSpinner] = useState(defaultVal);
  const [disableActions, setDisableActions] = useState(defaultVal);
  const [id] = useState(uuid());
  const [error, setError] = useState<ExtendedError | null>(null);
  const loadingOverlayRef = useRef<(() => void) | null>(null);

  // clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRefs[id]) superClearTimeout(id);
      if (!!loadingOverlayRef.current) {
        loadingOverlayRef.current();
      }
    };
  }, []);

  const waitSetLoading = (
    val: boolean,
    error: Error | null = null,
    options: { timeout?: number; withLoadingOverlay?: boolean } = {}
  ) => {
    const { timeout = 300, withLoadingOverlay } = options;

    if (timeoutRefs[id]) superClearTimeout(id);
    setDisableActions(val);
    setError(error ? parseError(error) : null);

    if (val) {
      timeoutRefs[id] = window.setTimeout(() => {
        if (withLoadingOverlay) {
          loadingOverlayRef.current = showLoadingOverlay();
        }
        setShowSpinner(val);
      }, timeout);
    } else {
      if (!!loadingOverlayRef.current) {
        loadingOverlayRef.current();
      }
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
