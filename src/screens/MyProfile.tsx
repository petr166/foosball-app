import React from 'react';
import { useGlobal } from 'reactn';

import { ScreenContainer, TextX, ButtonX } from '../components';
import { IScreenComponent } from './index';
import { IGlobalState } from '../global';
import { logout } from '../login';

export const MyProfile: IScreenComponent = () => {
  const [currentUser] = useGlobal<IGlobalState>('currentUser');
  const { name, email } = currentUser;

  return (
    <ScreenContainer>
      <TextX>You</TextX>

      <TextX>{name}</TextX>
      <TextX>{email}</TextX>

      <ButtonX
        title="Logout"
        onPress={() => {
          logout();
        }}
      />
    </ScreenContainer>
  );
};

MyProfile.options = {
  topBar: {
    title: {
      text: 'You',
    },
  },
};
