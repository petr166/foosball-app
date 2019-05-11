import React from 'react';

import { ScreenContainer, TextX } from '../components';
import { IScreenComponent } from '.';

export const Tournaments: IScreenComponent = () => {
  return (
    <ScreenContainer>
      <TextX>Tournaments</TextX>
    </ScreenContainer>
  );
};

Tournaments.options = {
  topBar: {
    title: {
      text: 'Tournaments',
    },
  },
};
