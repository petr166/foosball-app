import React from 'react';

import { ScreenContainer, TextX } from '../components';
import { IScreenComponent } from '.';

export const Notifications: IScreenComponent = () => {
  return (
    <ScreenContainer>
      <TextX>Notifications</TextX>
    </ScreenContainer>
  );
};

Notifications.options = {
  topBar: {
    title: {
      text: 'Notifications',
    },
  },
};
