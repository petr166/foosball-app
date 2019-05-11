import React, { FunctionComponent, ComponentType } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

interface Props extends ViewProps {}
export const ScreenContainer: FunctionComponent<Props> = ({
  style,
  ...props
}) => {
  return <View style={[styles.container, style]} {...props} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
