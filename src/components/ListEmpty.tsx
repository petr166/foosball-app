import { ViewProps, StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { FunctionComponent } from 'react';
import { TextX } from './TextX';

export interface ListEmptyProps extends ViewProps {}
export const ListEmpty: FunctionComponent<ListEmptyProps> = () => {
  return (
    <View style={styles.container}>
      <TextX>There are no results matching your search</TextX>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: '30%',
    minHeight: 100,
  },
});
