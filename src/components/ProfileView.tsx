import React, { FunctionComponent } from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';

import { Avatar } from './Avatar';
import { TextX } from './TextX';

export interface ProfileViewProps extends ViewProps {
  user: {
    name: string;
    avatar: string | null;
  };
  isCurrentUser?: boolean;
}
export const ProfileView: FunctionComponent<ProfileViewProps> = ({
  user: { avatar, name },
}) => {
  return (
    <FlatList
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View>
          <SafeAreaView style={{ marginBottom: 100 }} />
          <Avatar style={{ marginBottom: 18 }} avatar={avatar} size={140} />
          <TextX style={styles.name}>{name}</TextX>

          <View style={{ marginTop: 30 }}>
            <TextX>winstatshere</TextX>
          </View>
        </View>
      }
      data={[]}
      renderItem={() => null}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
  list: {},
  name: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
});
