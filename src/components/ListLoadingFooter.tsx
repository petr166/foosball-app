import { ViewProps, StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { FunctionComponent } from 'react';

export interface ListLoadingFooterProps extends ViewProps {}
export const ListLoadingFooter: FunctionComponent<ListLoadingFooterProps> = ({
  style,
}) => {
  return (
    <View style={[styles.loadingContainer, style]}>
      <ActivityIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    minWidth: 160,
    minHeight: 160,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
