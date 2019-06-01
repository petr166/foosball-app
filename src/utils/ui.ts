import { Platform, Dimensions } from 'react-native';
import { Navigation } from 'react-native-navigation';
import moment from 'moment';

import { LOADING_OVERLAY, BANNER } from '../screens';
import { ShowBannerProps } from '../screens/Misc/Banner';

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
    width: 0.5,
    height: 0.5,
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

export const showBanner = async (props: ShowBannerProps) => {
  return Navigation.showOverlay({
    component: {
      name: BANNER,
      passProps: props,
      options: { overlay: { interceptTouchOutside: false } },
    },
  });
};

export const listKeyExtractor = (item: any) => {
  return item.id;
};

export const getTournamentTimeString = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  let timeStr = '';
  const now = moment();
  const start = moment(Number(startDate));
  const end = moment(Number(endDate));
  if (now.isBefore(start)) {
    timeStr = 'starts ' + start.fromNow();
  } else if (now.isBefore(end)) {
    timeStr = 'ends ' + end.fromNow();
  } else {
    timeStr = 'ended on ' + end.format('DD/MM');
  }

  return timeStr;
};
