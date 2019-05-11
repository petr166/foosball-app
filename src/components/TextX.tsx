import React, { FunctionComponent } from 'react';
import { Text, TextProps } from 'react-native';

interface Props extends TextProps {}
export const TextX: FunctionComponent<Props> = props => {
  return <Text {...props} />;
};
