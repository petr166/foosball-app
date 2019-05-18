import React from 'react';
import { ImageURISource, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Options, Navigation } from 'react-native-navigation';

import { CreateTournamentView } from '../components';
import { IScreenComponent, ScreenComponentProps } from './index';
import { TOP_BAR_ICON_SIZE } from '../config/styles';
import { useNavBtnPress } from '../hooks';

const CLOSE_ID = 'CreateTournament.close';

let closeIcon: ImageURISource;
Icon.getImageSource('times', TOP_BAR_ICON_SIZE, undefined).then(src => {
  closeIcon = src;
});

export interface TournamentsProps extends ScreenComponentProps {}
export const CreateTournament: IScreenComponent<TournamentsProps> = ({
  componentId,
}) => {
  useNavBtnPress(() => {
    Navigation.dismissModal(componentId);
  }, CLOSE_ID);

  return (
    <CreateTournamentView
      tournament={{}}
      onSavePressed={(form: any) => {
        console.log('====================================');
        console.log('save pressed', form);
        console.log('====================================');
      }}
    />
  );
};

CreateTournament.options = (): Options => ({
  // @ts-ignore 2322
  topBar: {
    title: {
      text: 'New Tournament',
    },
    leftButtons: [
      {
        id: CLOSE_ID,
        icon: closeIcon,
      },
    ],
  },
});
