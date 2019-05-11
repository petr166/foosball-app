import React, { FunctionComponent, useEffect } from 'react';

import { ScreenContainer, TextX, ButtonX } from '../components';
import { logout } from '../login';
import { IGlobalState } from '../global';
import { useGlobal } from 'reactn';

export const Home: FunctionComponent = () => {
  const [currentUser] = useGlobal<IGlobalState>('currentUser');
  const { name, email } = currentUser;

  return (
    <ScreenContainer>
      <TextX>Home</TextX>

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
