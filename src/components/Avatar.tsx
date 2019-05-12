import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacityProps,
  TouchableOpacity,
  ImageURISource,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { ImageX } from './ImageX';

const BORDER_WIDTH = 4;

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
  const [failed, setFailed] = useState(false);

  let failedTimeout: number;
  useEffect(() => {
    if (avatar) {
      failedTimeout = setTimeout(() => {
        setFailed(true);
      }, 5000);
    }

    return () => {
      if (failedTimeout) clearTimeout(failedTimeout);
    };
  }, []);

  const defaultImgSize = (size * 60) / 100;

  return (
    <TouchableOpacity
      style={[styles.button, getRoundStyles(size)]}
      disabled={!onPress}
    >
      {avatar && !failed ? (
        <ImageX
          source={{ uri: avatar }}
          style={[styles.img, getRoundStyles(size - BORDER_WIDTH / 2)]}
          resizeMode="cover"
          onLoad={() => {
            if (failedTimeout) clearTimeout(failedTimeout);
          }}
          onError={() => {
            setFailed(true);
          }}
        />
      ) : (
        <ImageX
          source={defaultProfileImg}
          defaultSource={defaultProfileImg}
          style={getRoundStyles(defaultImgSize)}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: BORDER_WIDTH,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    overflow: 'hidden',
  },
});
