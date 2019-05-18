import React, { FunctionComponent } from 'react';
import { Navigation, Options } from 'react-native-navigation';
import { ComponentType } from 'react';
import { ApolloClient } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo-hooks';

import * as screenNames from './screenNames';
export * from './screenNames'; // to get them from /screens
import { Register } from './Register';
import { Home } from './Home';
import { Login } from './Login';
import { Tournaments } from './Tournaments';
import { Notifications } from './Notifications';
import { Profile } from './Profile';
import { MyProfile } from './MyProfile';
import { CreateTournament } from './CreateTournament';

export interface IScreenComponent<P> extends FunctionComponent<P> {
  options?: Options | ((props?: any) => Options);
}
export interface ScreenComponentProps {
  componentId: number;
}

const registerScreen = (
  name: string,
  ComponentX: IScreenComponent<ScreenComponentProps>,
  apolloClient: ApolloClient<any>
) => {
  Navigation.registerComponent(
    name,
    () => props => (
      <ApolloProvider client={apolloClient}>
        <ComponentX {...props} />
      </ApolloProvider>
    ),
    () => ComponentX
  );
};

export const registerAppScreens = (apolloClient: ApolloClient<any>) => {
  registerScreen(screenNames.REGISTER, Register, apolloClient);
  registerScreen(screenNames.HOME, Home, apolloClient);
  registerScreen(screenNames.LOGIN, Login, apolloClient);
  registerScreen(screenNames.TOURNAMENTS, Tournaments, apolloClient);
  registerScreen(screenNames.NOTIFICATIONS, Notifications, apolloClient);
  registerScreen(screenNames.PROFILE, Profile, apolloClient);
  registerScreen(screenNames.MY_PROFILE, MyProfile, apolloClient);
  registerScreen(screenNames.CREATE_TOURNAMENT, CreateTournament, apolloClient);
};
