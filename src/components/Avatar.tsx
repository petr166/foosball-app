import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacityProps,
  TouchableOpacity,
  ImageURISource,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { ImageX } from './ImageX';
import { colors } from '../config/styles';

let defaultProfileImg: ImageURISource;
Icon.getImageSource('user-alt', 160, colors.secondary).then(src => {
  defaultProfileImg = src;
});

const getRoundStyles = (size: number) => ({
  width: size,
  height: size,
  borderRadius: size / 2,
});

interface AvatarProps extends TouchableOpacityProps {
  avatar: string | null;
  size?: number;
}
export const Avatar: FunctionComponent<AvatarProps> = ({
  avatar,
  size = 30,
  onPress,
  style,
  ...props
}) => {
  const defaultImgSize = (size * 60) / 100;
  const borderWidth = (size * 3) / 100;

  return (
    <TouchableOpacity
      style={[styles.button, getRoundStyles(size), { borderWidth }, style]}
      disabled={!onPress}
      onPress={onPress}
      {...props}
    >
      <ImageX
        source={avatar ? { uri: avatar } : defaultProfileImg}
        style={[styles.img, getRoundStyles(size - borderWidth / 2)]}
        resizeMode="cover"
        isDefaultImg={!avatar}
        defaultImageProps={{
          source: defaultProfileImg,
          style: getRoundStyles(defaultImgSize),
          resizeMode: 'contain',
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  img: {
    overflow: 'hidden',
  },
});
