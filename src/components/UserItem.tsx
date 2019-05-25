import React, { FunctionComponent } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { IUser } from '../fragments';
import { TextX } from './TextX';
import { Avatar } from './Avatar';
import { colors } from '../config/styles';

export const USER_ITEM_HEIGHT = 60;

export interface UserItemProps extends TouchableOpacityProps {
  user: IUser;
  isSelected?: boolean;
}
export const UserItem: FunctionComponent<UserItemProps> = ({
  user: { name, avatar },
  isSelected,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, isSelected && styles.buttonSelected]}
      {...props}
    >
      <Avatar avatar={avatar} size={40} />
      <TextX style={styles.name}>{name}</TextX>

      {!!isSelected && (
        <Icon
          style={{ marginLeft: 'auto' }}
          name="check-circle"
          color={colors.primary}
          solid
          size={25}
        />
      )}
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
  buttonSelected: {
    backgroundColor: '#E8E8E8',
  },
  name: {
    marginLeft: 8,
  },
});
