import { Navigation } from 'react-native-navigation';

import { PROFILE } from '../screens';

export const goToUserProfile = (componentId: string, userId: string) => {
  return Navigation.push(componentId, {
    component: { name: PROFILE, passProps: { userId } },
  });
};
