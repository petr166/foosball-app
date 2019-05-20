import { Platform, Dimensions } from 'react-native';
import { Navigation } from 'react-native-navigation';

import { LOADING_OVERLAY, BANNER } from '../screens';

export const LOADING_OVERLAY_COMPONENT_ID = 'LOADING_OVERLAY_COMPONENT_ID';

export const getNavBarHeight = () => {
  if (Platform.OS === 'ios') {
    const { height, width } = Dimensions.get('window');

    // iPhone X navbar height (regular title);
    if (height === 812 || width === 812) {
      return 64;
    }

    return 64; // iPhone navbar height;
  }

  return 56; // android portrait navbar height;
};

export const getBoxShadowStyles = (options: any = {}) => ({
  elevation: 1,
  shadowColor: '#000',
  shadowOffset: {
    width: 1,
    height: 1,
  },
  shadowRadius: 2,
  shadowOpacity: 0.3,
  ...options,
});

export const showLoadingOverlay = () => {
  Navigation.showOverlay({
    component: { id: LOADING_OVERLAY_COMPONENT_ID, name: LOADING_OVERLAY },
  });

  return () => {
    Navigation.dismissOverlay(LOADING_OVERLAY_COMPONENT_ID);
  };
};

export const showBanner = async (props: any) => {
  return Navigation.showOverlay({
    component: { name: BANNER, passProps: props },
  });
};
