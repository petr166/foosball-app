import { Platform, Dimensions } from 'react-native';

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
