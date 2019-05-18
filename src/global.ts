import { setGlobal, addCallback } from 'reactn';
import AsyncStorage from '@react-native-community/async-storage';
import { merge } from 'lodash';

import { STORAGE_KEY } from './config/constants';

export enum ROOT {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  HOME = 'HOME',
}

export interface IGlobalState {
  root: ROOT;
  authToken: string | null;
  currentUser: any;
}

export const initialState: IGlobalState = {
  root: ROOT.REGISTER,
  authToken: null,
  currentUser: { games: { edges: [] } },
};

const persistState = (globalState: IGlobalState) => {
  console.log('GLOBAL STATE CHANGE:', globalState);
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));

  return null;
};

export const initGlobal = async (): Promise<IGlobalState> =>
  new Promise(async resolve => {
    // await AsyncStorage.clear();
    const stateFromStorage = await AsyncStorage.getItem(STORAGE_KEY);
    const persistedState = stateFromStorage ? JSON.parse(stateFromStorage) : {};

    const state = { ...initialState };
    merge(state, persistedState);
    console.log('STATE:', state);

    setGlobal<IGlobalState>(state, (globalState: IGlobalState) => {
      addCallback(persistState);
      resolve(globalState);
    });
  });
