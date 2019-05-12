import React, { FunctionComponent } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

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
  isCurrentUser,
}) => {
  return (
    <View style={styles.container}>
      <Avatar avatar={avatar} size={140} />
      <TextX style={styles.name}>{name}</TextX>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  name: {
    textAlign: 'center',
  },
});
