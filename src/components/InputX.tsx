import React, { FunctionComponent } from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

interface Props extends TextInputProps {}
export const InputX: FunctionComponent<Props> = ({ style, ...props }) => {
  return <TextInput style={[styles.input, style]} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#000',
    width: '100%',
    padding: 10,
  },
});
