import React, { FunctionComponent } from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

const fontFamilyMap = {
  regular: 'Roboto_Regular',
  medium: 'Roboto_Medium',
  bold: 'Roboto_Bold',
  black: 'Roboto_Black',
};

export interface TextXProps extends TextProps {
  shadowed?: boolean;
}
export const TextX: FunctionComponent<TextXProps> = ({
  style,
  shadowed = true,
  ...props
}) => {
  let fontFamily = fontFamilyMap.medium;
  if (style) {
    const propStyles = StyleSheet.flatten(style);
    if (propStyles.fontWeight) {
      const numberWeight = Number(propStyles.fontWeight);
      if (numberWeight) {
        if (numberWeight <= 400) fontFamily = fontFamilyMap.regular;
        else if (numberWeight <= 500) fontFamily = fontFamilyMap.medium;
        else if (numberWeight <= 700) fontFamily = fontFamilyMap.bold;
        else if (numberWeight <= 900) fontFamily = fontFamilyMap.black;
      }
    }
  }

  return (
    <Text
      style={[styles.text, shadowed && styles.shadowed, style, { fontFamily }]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#000',
    fontFamily: fontFamilyMap.medium,
    fontSize: 15,
  },
  shadowed: {
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowColor: 'rgba(0,0,0,.3)',
    textShadowRadius: 1,
  },
});
