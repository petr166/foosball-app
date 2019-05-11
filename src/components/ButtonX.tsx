import React, { FunctionComponent } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { TextX } from './TextX';

interface Props extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
}
export const ButtonX: FunctionComponent<Props> = ({
  style,
  title,
  isLoading,
  ...props
}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      {isLoading ? <ActivityIndicator /> : <TextX>{title}</TextX>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderColor: '#000',
    borderWidth: 1,
    padding: 12,
    minWidth: 80,
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
