import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacityProps,
  TouchableOpacity,
  ImageURISource,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { ImageX } from './ImageX';

let defaultProfileImg: ImageURISource;
Icon.getImageSource('user-alt', 160).then(src => {
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
}) => {
  const defaultImgSize = (size * 60) / 100;
  const borderWidth = (size * 3) / 100;

  return (
    <TouchableOpacity
      style={[styles.button, getRoundStyles(size), { borderWidth }]}
      disabled={!onPress}
    >
      <ImageX
        source={avatar ? { uri: avatar } : defaultProfileImg}
        style={[styles.img, getRoundStyles(size - borderWidth / 2)]}
        resizeMode="cover"
        isDefaultImg={!avatar}
        defaultImageProps={{
          source: defaultProfileImg,
          defaultSource: defaultProfileImg,
          style: getRoundStyles(defaultImgSize),
          resizeMode: 'contain',
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    overflow: 'hidden',
  },
});