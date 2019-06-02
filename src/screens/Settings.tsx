import React from 'react';
import { View } from 'react-native';

import { IScreenComponent, ScreenComponentProps } from './index';
import { ScreenContainer, ButtonX } from '../components';
import { logout } from '../login';

export const Settings: IScreenComponent<ScreenComponentProps> = () => {
  return (
    <ScreenContainer>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 100,
        }}
      >
        <ButtonX
          title="Logout"
          style={{ backgroundColor: 'darkred' }}
          onPress={() => {
            logout();
          }}
        />
      </View>
    </ScreenContainer>
  );
};

Settings.options = {
  topBar: { title: { text: 'Settings' } },
};
