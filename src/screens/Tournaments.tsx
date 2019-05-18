import React, { useEffect } from 'react';
import { ImageURISource } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Options, Navigation } from 'react-native-navigation';

import { ScreenContainer, TextX } from '../components';
import { IScreenComponent, ScreenComponentProps } from './index';
import { TOP_BAR_ICON_SIZE } from '../config/styles';
import { useNavBtnPress } from '../hooks';
import { CREATE_TOURNAMENT } from './screenNames';

const ADD_ID = 'Tournaments.add';

let addIcon: ImageURISource;
Icon.getImageSource('plus', TOP_BAR_ICON_SIZE, undefined).then(src => {
  addIcon = src;
});

export interface TournamentsProps extends ScreenComponentProps {}
export const Tournaments: IScreenComponent<TournamentsProps> = () => {
  useNavBtnPress(() => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: { name: CREATE_TOURNAMENT },
          },
        ],
      },
    });
  }, ADD_ID);

  // TODO: remove
  useEffect(() => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: { name: CREATE_TOURNAMENT },
          },
        ],
      },
    });
  }, []);

  return (
    <ScreenContainer>
      <TextX>Tournaments</TextX>
    </ScreenContainer>
  );
};

Tournaments.options = (): Options => ({
  // @ts-ignore 2322
  topBar: {
    title: {
      text: 'Tournaments',
    },
    rightButtons: [
      {
        id: ADD_ID,
        icon: addIcon,
      },
    ],
  },
});
