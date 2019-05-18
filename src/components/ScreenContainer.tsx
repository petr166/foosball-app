import React, { FunctionComponent } from 'react';
import { StyleSheet, ScrollView, ScrollViewProps } from 'react-native';

interface ScreenContainerProps extends ScrollViewProps {}
export const ScreenContainer: FunctionComponent<ScreenContainerProps> = ({
  style,
  ...props
}) => {
  return <ScrollView style={[styles.container, style]} {...props} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
