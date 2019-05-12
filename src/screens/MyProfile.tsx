import React from 'react';
import { useGlobal } from 'reactn';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Options } from 'react-native-navigation';

import { ScreenContainer, ButtonX, ProfileView } from '../components';
import { IScreenComponent, ScreenComponentProps } from './index';
import { IGlobalState } from '../global';
import { logout } from '../login';
import { ImageURISource } from 'react-native';
import { useNavBtnPress } from '../hooks';
import { TOP_BAR_ICON_SIZE } from '../config/styles';

const SETTINGS_ID = 'MyProfile.settings';

let settingsIcon: ImageURISource;
Icon.getImageSource('cog', TOP_BAR_ICON_SIZE).then(src => {
  settingsIcon = src;
});

export interface MyProfileProps extends ScreenComponentProps {}
export const MyProfile: IScreenComponent<MyProfileProps> = () => {
  const [currentUser] = useGlobal<IGlobalState>('currentUser');
  useNavBtnPress(() => {
    console.log('====================================');
    console.log('pressed settings');
    console.log('====================================');
  }, SETTINGS_ID);

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

MyProfile.options = (): Options => ({
  // @ts-ignore 2322
  topBar: {
    drawBehind: true,
    background: {
      color: 'transparent',
      translucent: true,
    },
    rightButtons: [
      {
        id: SETTINGS_ID,
        icon: settingsIcon,
      },
    ],
  },
});
