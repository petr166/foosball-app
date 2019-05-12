import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import {
  Image,
  View,
  ImageProps,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  ImageURISource,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { useLoading } from '../hooks';
import { CachedImage } from 'react-native-img-cache';

let defaultImgSource: ImageURISource;
Icon.getImageSource('image', 200).then(src => {
  defaultImgSource = src;
});

const getBaseDefaultImageProps = (): ImageProps => {
  return {
    source: defaultImgSource,
    resizeMode: 'contain',
  };
};

export interface ImageXProps extends ImageProps {
  defaultImageProps?: ImageProps;
  isDefaultImg?: boolean;
}
export const ImageX: FunctionComponent<ImageXProps> = ({
  style,
  defaultImageProps: { style: defaultImgStyle, ...defaultImageProps } = {
    style: {},
  },
  isDefaultImg = false,
  onLoadStart,
  onLoad,
  onError,
  ...props
}) => {
  const [failed, setFailed] = useState(false);
  const [showSpinner, setShowSpinner] = useLoading(false);
  // hold ref to showSpinner for use in timeout
  const showSpinnerRef = useRef(showSpinner);
  showSpinnerRef.current = showSpinner;

  useEffect(() => {
    setShowSpinner(true);

    const failTimeout = window.setTimeout(() => {
      setFailed((prevFailed: boolean) => {
        if (!prevFailed && showSpinnerRef.current) return true;
        return prevFailed;
      });
    }, 5000);

    return () => {
      if (failTimeout) clearTimeout(failTimeout);
    };
  }, []);

  let containerDimensions: ViewStyle = {};
  if (style) {
    const styleObj = StyleSheet.flatten([style]);
    if (styleObj.width) containerDimensions.width = styleObj.width;
    if (styleObj.height) containerDimensions.height = styleObj.height;
  }

  return (
    <View style={[styles.container, containerDimensions]}>
      {failed || isDefaultImg ? (
        <Image
          style={[styles.img, styles.defaultImgBase, defaultImgStyle]}
          onLoadStart={(...args) => {
            setShowSpinner(true);
            if (onLoadStart) onLoadStart(...args);
          }}
          onLoad={(...args) => {
            setShowSpinner(false);
            if (onLoad) onLoad(...args);
          }}
          onError={(...args) => {
            setShowSpinner(false);
            setFailed(true);
            if (onError) onError(...args);
          }}
          {...props}
          {...getBaseDefaultImageProps()}
          {...defaultImageProps}
        />
      ) : (
        <CachedImage
          style={[styles.img, style]}
          onLoadStart={(...args) => {
            setShowSpinner(true);
            if (onLoadStart) onLoadStart(...args);
          }}
          onLoad={(...args) => {
            setShowSpinner(false);
            if (onLoad) onLoad(...args);
          }}
          onError={(...args) => {
            setShowSpinner(false);
            setFailed(true);
            if (onError) onError(...args);
          }}
          {...props}
        />
      )}

      {showSpinner && (
        <View style={styles.spinnerView}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 140,
    height: 140,
  },
  spinnerView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultImgBase: {
    overflow: 'visible',
  },
});
