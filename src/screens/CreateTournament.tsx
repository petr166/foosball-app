import React from 'react';
import { ImageURISource } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Options } from 'react-native-navigation';

import { ScreenContainer, TextX } from '../components';
import { IScreenComponent, ScreenComponentProps } from './index';
import { TOP_BAR_ICON_SIZE } from '../config/styles';
import { useNavBtnPress } from '../hooks';

const ADD_ID = 'Tournaments.settings';

let addIcon: ImageURISource;
Icon.getImageSource('plus', TOP_BAR_ICON_SIZE, undefined).then(src => {
  addIcon = src;
});

export interface TournamentsProps extends ScreenComponentProps {}
export const CreateTournament: IScreenComponent<TournamentsProps> = () => {
  useNavBtnPress(() => {
    console.log('====================================');
    console.log('pressed add');
    console.log('====================================');
  }, ADD_ID);

  return (
    <ScreenContainer>
      <TextX>CreateTournament</TextX>
    </ScreenContainer>
  );
};

CreateTournament.options = (): Options => ({
  // @ts-ignore 2322
  topBar: {
    title: {
      text: 'CreateTournament',
    },
    rightButtons: [
      {
        id: ADD_ID,
        icon: addIcon,
      },
    ],
  },
});
