import React from 'react';

import { ScreenContainer, TextX } from '../components';
import { IScreenComponent } from '.';

export const Home: IScreenComponent = () => {
  return (
    <ScreenContainer>
      <TextX>Feed</TextX>
    </ScreenContainer>
  );
};

Home.options = {
  topBar: {
    title: {
      text: 'Feed',
    },
  },
};
