import { ViewProps, StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { FunctionComponent } from 'react';

export interface ListLoadingFooterProps extends ViewProps {}
export const ListLoadingFooter: FunctionComponent<
  ListLoadingFooterProps
> = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    marginVertical: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
