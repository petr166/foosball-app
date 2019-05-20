import React, { FunctionComponent } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export const Loading: FunctionComponent = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
