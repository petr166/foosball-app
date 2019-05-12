import React from 'react';
import { useGlobal } from 'reactn';

import { ScreenContainer, ButtonX, ProfileView } from '../components';
import { IScreenComponent } from './index';
import { IGlobalState } from '../global';
import { logout } from '../login';

export const MyProfile: IScreenComponent = () => {
  const [currentUser] = useGlobal<IGlobalState>('currentUser');

  return (
    <ScreenContainer>
      <ProfileView user={currentUser} isCurrentUser />

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
