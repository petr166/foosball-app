import React, { FunctionComponent } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { TextX, TextXProps } from './TextX';
import { colors } from '../config/styles';

interface Props extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  textProps?: TextXProps;
}
export const ButtonX: FunctionComponent<Props> = ({
  style,
  title,
  isLoading,
  textProps: { style: textStyle, ...textProps } = {},
  disabled,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabledButton]}
      disabled={disabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <TextX style={[styles.text, textStyle]} {...textProps}>
          {title}
        </TextX>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    width: 220,
    borderRadius: 1000,
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  text: {
    color: '#fff',
  },
});
