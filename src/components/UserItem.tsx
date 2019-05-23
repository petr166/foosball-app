import React, { FunctionComponent } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { IUser } from '../fragments';
import { TextX } from './TextX';
import { Avatar } from './Avatar';

export const USER_ITEM_HEIGHT = 60;

export interface UserItemProps extends TouchableOpacityProps {
  user: IUser;
}
export const UserItem: FunctionComponent<UserItemProps> = ({
  user: { name, avatar },
  style,
  ...props
}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      <Avatar avatar={avatar} size={40} />
      <TextX style={styles.name}>{name}</TextX>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: USER_ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
  },
  name: {
    marginLeft: 8,
  },
});
