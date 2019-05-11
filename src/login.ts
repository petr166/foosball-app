import { setGlobal, getGlobal } from 'reactn';
import { merge } from 'lodash';

import { ROOT, initialState } from './global';

export const login = async ({ token, user }: any) => {
  const state = { ...getGlobal() };
  return setGlobal(
    merge(state, { root: ROOT.HOME, authToken: token, currentUser: user })
  );
};

export const logout = async () => {
  return setGlobal({ ...initialState, root: ROOT.LOGIN });
};
