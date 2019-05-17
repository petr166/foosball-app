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
