import { Options } from 'react-native-navigation';

import { colors } from './styles';

export const defaultNavOptions: Options = {
  topBar: {
    animate: true,
    // @ts-ignore 2322
    leftButtonColor: '#000',
    rightButtonColor: '#000',
    alignment: 'center',
    title: {
      alignment: 'center',
      color: '#000',
    },
    backButton: {
      color: '#000',
      title: '',
      showTitle: false,
    },
  },
  bottomTabs: {
    animate: true,
    titleDisplayMode: 'alwaysShow',
    currentTabIndex: 0, // TODO: dev remove
  },
  bottomTab: {
    selectedIconColor: colors.primary,
  },
};
