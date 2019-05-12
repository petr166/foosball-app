import React, { FunctionComponent, Component } from 'react';
import { CachedImageProps, CustomCachedImage } from 'react-native-img-cache';
import Image from 'react-native-image-progress';
import { StyleSheet } from 'react-native';

export interface ImageXProps extends CachedImageProps {
  component?: new () => Component<any, any>;
}
export const ImageX: FunctionComponent<ImageXProps> = ({
  component = Image,
  style,
  ...props
}) => {
  return (
    <CustomCachedImage
      style={[styles.img, style]}
      component={component}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  img: {
    width: 140,
    height: 140,
  },
});
