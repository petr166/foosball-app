import React, { FunctionComponent } from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

export interface TextXProps extends TextProps {
  shadowed?: boolean;
}
export const TextX: FunctionComponent<TextXProps> = ({
  style,
  shadowed = true,
  ...props
}) => {
  return (
    <Text
      style={[styles.text, shadowed && styles.shadowed, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#000',
    fontWeight: '500',
    fontSize: 15,
  },
  shadowed: {
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowColor: 'rgba(0,0,0,.3)',
    textShadowRadius: 1,
  },
});
